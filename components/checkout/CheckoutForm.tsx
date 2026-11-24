'use client'

import { useState, useEffect } from 'react'
import { Lock, Mail, User, Phone, CreditCard, Home, MapPin, type LucideIcon } from 'lucide-react'
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
  return `w-full ${padding} py-4 bg-gray-50 border-2 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-blue-300'
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
      <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-2.5">
        {label}{' '}
        {optional ? (
          <span className="text-gray-500 text-xs font-normal">(Optional)</span>
        ) : (
          <span className="text-red-500 font-bold">*</span>
        )}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          id={id}
          name={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass(error, 'pl-12 pr-4')}
          {...input}
        />
      </div>
      {error && <p id={`${id}-error`} className="mt-2 text-sm text-red-600">{error}</p>}
      {hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
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

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 hover:shadow-blue-500/10 transition-all duration-500">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Delivery Details</h2>
            <p className="text-sm text-gray-600">Almost there! Tell us where to send your order</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-7">
        <Field id="name" label="Full Name" type="text" icon={User} autoComplete="name" value={formData.name} error={errors.name} onChange={handleChange} />
        <Field id="email" label="Email Address" type="email" icon={Mail} autoComplete="email" hint="Your order confirmation will be sent to this email" value={formData.email} error={errors.email} onChange={handleChange} />
        <Field id="phone" label="Mobile Number" type="tel" icon={Phone} autoComplete="tel" hint="The courier may call this number" value={formData.phone} error={errors.phone} onChange={handleChange} />
        <Field id="address1" label="House No., Building, Street" type="text" icon={Home} autoComplete="address-line1" value={formData.address1} error={errors.address1} onChange={handleChange} />
        <Field id="address2" label="Area, Landmark" type="text" icon={MapPin} autoComplete="address-line2" optional value={formData.address2} error={errors.address2} onChange={handleChange} />
        <div className="grid sm:grid-cols-2 gap-7">
          <Field id="city" label="City / Town" type="text" icon={MapPin} autoComplete="address-level2" value={formData.city} error={errors.city} onChange={handleChange} />
          <Field id="pincode" label="PIN Code" type="text" icon={MapPin} autoComplete="postal-code" inputMode="numeric" value={formData.pincode} error={errors.pincode} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-semibold text-gray-800 mb-2.5">
            State <span className="text-red-500 font-bold">*</span>
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
          {errors.state && <p id="state-error" className="mt-2 text-sm text-red-600">{errors.state}</p>}
          <p className="mt-2 text-xs text-gray-500">We currently deliver within India.</p>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
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
              className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              I agree to the{' '}
              <a href="/terms" target="_blank" className="text-blue-600 hover:text-blue-800 font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-600 transition-colors">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-800 font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-600 transition-colors">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.terms && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 font-medium animate-pulse">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.terms}
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-inner">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
                🔒 Bank-Level Security
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Your payment is processed through Razorpay's secure gateway with 256-bit SSL encryption. We never store your card details on our servers.
              </p>
            </div>
          </div>
        </div>

        {paymentError && (
          <p role="alert" className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {paymentError}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !ready}
          className="relative w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold text-lg py-5 px-8 rounded-xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          
          <div className="relative flex items-center justify-center gap-3">
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                <span>Complete Secure Payment</span>
                <CreditCard className="h-6 w-6 group-hover:-rotate-12 transition-transform" />
              </>
            )}
          </div>
        </button>

        {/* Trust Signals */}
        <div className="pt-6 border-t-2 border-dashed border-gray-300">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-green-800">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-blue-800">100% Secure</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
              <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-purple-800">Money Back</span>
            </div>
          </div>
        </div>
      </form>
    </div>
    </>
  )
}
