'use client'

import { useState, useEffect } from 'react'
import { Lock, Mail, User, Phone, Home, MapPin, type LucideIcon } from 'lucide-react'
import { INDIAN_STATES, emptyDeliveryDetails, validateDeliveryDetails } from '@/lib/checkout'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface CheckoutFormProps {
  product: {
    _id: string
    name: string
    price: number
    currency: string
  }
}

function inputClass(error: string | undefined, padding: string) {
  return `w-full ${padding} min-h-[52px] bg-cream border-2 rounded-2xl text-charcoal placeholder-charcoal/40 focus:bg-white focus:outline-none focus:border-forest transition-colors ${
    error ? 'border-red-400 bg-red-50' : 'border-[#EAE0CC] hover:border-[#D9CBB0]'
  }`
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  icon: LucideIcon
  error?: string
  hint?: string
  optional?: boolean
}

function Field({ id, label, icon: Icon, error, hint, optional, ...input }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-charcoal mb-2">
        {label}{' '}
        {optional ? (
          <span className="text-[#6B5F58] text-xs font-normal">(optional)</span>
        ) : (
          <span className="text-terracotta" aria-hidden="true">*</span>
        )}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9C8F86] pointer-events-none" />
        <input
          id={id}
          name={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass(error, 'pl-12 pr-4')}
          {...input}
        />
      </div>
      {error && <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-red-700">{error}</p>}
      {hint && <p className="mt-2 text-xs text-[#6B5F58]">{hint}</p>}
    </div>
  )
}

export default function CheckoutForm({ product }: CheckoutFormProps) {
  const [formData, setFormData] = useState(emptyDeliveryDetails)
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Until the page is interactive, submitting would put the address in the URL
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true)
    }
  }, [])

  const validateForm = () => {
    const newErrors: any = { ...validateDeliveryDetails(formData).errors }

    // Terms validation
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError('')

    if (!validateForm()) {
      return
    }

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      setPaymentError('The payment system is still loading. Please wait a moment and try again.')
      return
    }

    setLoading(true)
    // Set once Razorpay takes the money: from then on, closing the popup isn't a cancellation
    let paid = false

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          delivery: formData,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        if (orderData.errors) setErrors(orderData.errors)
        throw new Error(orderData.message || 'Failed to create order')
      }

      // Step 2: Initialize Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Millet Mountain',
        description: product.name,
        order_id: orderData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#1e3a5f',
        },
        handler: async function (response: any) {
          paid = true
          setPaymentError('')
          // Step 3: Verify payment
          try {
            const verifyResponse = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Redirect to the order confirmation
              window.location.href = `/order/${verifyData.order.orderNumber}`
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Verification error:', error)
            setPaymentError(
              `We could not confirm your payment. Please do not pay again. Contact us with this payment ID: ${response.razorpay_payment_id}`
            )
            setLoading(false)
          }
        },
        modal: {
          ondismiss: function () {
            if (paid) return
            setLoading(false)
            setPaymentError((current) => current || 'Payment cancelled. You have not been charged.')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      // The popup stays open after a failure so the customer can try another method
      razorpay.on('payment.failed', function (response: any) {
        setPaymentError(`Payment failed. ${response?.error?.description || 'Please try again.'}`)
      })
      razorpay.open()
    } catch (error: any) {
      console.error('Checkout error:', error)
      setPaymentError(error.message || 'Checkout failed. Please try again.')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <>
      {/* Load Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        strategy="lazyOnload"
      />

      <div className="bg-white border-2 border-[#EFE7DA] rounded-[32px] p-6 md:p-10">
      <div className="mb-8">
        <p className="text-[13px] font-bold tracking-[0.1em] uppercase text-terracotta-dark mb-2">Step 1 of 2</p>
        <h2 className="font-heading text-3xl font-extrabold leading-tight">Delivery details</h2>
        <p className="text-[#5A4E48] mt-1">Tell us where to send your order. You pay on the next screen.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Field id="name" label="Full Name" type="text" icon={User} autoComplete="name" value={formData.name} error={errors.name} onChange={handleChange} />
        <Field id="email" label="Email Address" type="email" icon={Mail} autoComplete="email" hint="Your order confirmation will be sent to this email" value={formData.email} error={errors.email} onChange={handleChange} />
        <Field id="phone" label="Mobile Number" type="tel" icon={Phone} autoComplete="tel" hint="The courier may call this number" value={formData.phone} error={errors.phone} onChange={handleChange} />
        <Field id="address1" label="House No., Building, Street" type="text" icon={Home} autoComplete="address-line1" value={formData.address1} error={errors.address1} onChange={handleChange} />
        <Field id="address2" label="Area, Landmark" type="text" icon={MapPin} autoComplete="address-line2" optional value={formData.address2} error={errors.address2} onChange={handleChange} />
        <div className="grid sm:grid-cols-2 gap-6">
          <Field id="city" label="City / Town" type="text" icon={MapPin} autoComplete="address-level2" value={formData.city} error={errors.city} onChange={handleChange} />
          <Field id="pincode" label="PIN Code" type="text" icon={MapPin} autoComplete="postal-code" inputMode="numeric" value={formData.pincode} error={errors.pincode} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-bold text-charcoal mb-2">
            State <span className="text-terracotta" aria-hidden="true">*</span>
          </label>
          <select
            id="state"
            name="state"
            autoComplete="address-level1"
            value={formData.state}
            onChange={handleChange}
            aria-invalid={Boolean(errors.state)}
            aria-describedby={errors.state ? 'state-error' : undefined}
            className={inputClass(errors.state, 'px-4')}
          >
            <option value="">Select your state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <p id="state-error" className="mt-2 text-sm font-semibold text-red-700">{errors.state}</p>}
          <p className="mt-2 text-xs text-[#6B5F58]">We currently deliver within India.</p>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-cream rounded-2xl p-5">
          <label className="flex items-start gap-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked)
                if (errors.terms) {
                  setErrors((prev: any) => ({ ...prev, terms: '' }))
                }
              }}
              className="mt-0.5 h-5 w-5 accent-forest cursor-pointer"
            />
            <span className="text-sm text-[#5A4E48] leading-relaxed">
              I agree to the{' '}
              <a href="/terms" target="_blank" className="text-terracotta-dark font-semibold underline underline-offset-2 hover:text-charcoal">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" className="text-terracotta-dark font-semibold underline underline-offset-2 hover:text-charcoal">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className="mt-3 text-sm font-semibold text-red-700">{errors.terms}</p>
          )}
        </div>

        {paymentError && (
          <p role="alert" className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {paymentError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !ready}
          className="w-full inline-flex items-center justify-center gap-2.5 min-h-[56px] px-8 rounded-full bg-terracotta hover:bg-terracotta-dark text-cream font-bold text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Processing payment...
            </>
          ) : (
            <>
              <Lock className="h-5 w-5" aria-hidden="true" />
              Continue to payment
            </>
          )}
        </button>
        <p className="text-center text-sm text-[#6B5F58]">
          Payments are handled securely by Razorpay. We never see or store your card details.
        </p>
      </form>
    </div>
    </>
  )
}
