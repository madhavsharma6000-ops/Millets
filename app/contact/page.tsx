'use client'

import { useState } from 'react'
import { Mail, Send, Linkedin, Twitter, MessageSquare, ShoppingBag, Store, Users, Leaf, Sprout, Gift, GraduationCap, Check } from 'lucide-react'
import NewsletterForm from '@/components/forms/NewsletterForm'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: '',
    budget: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [responseMessage, setResponseMessage] = useState('')

  const inquiryTypes = [
    { value: 'bulk-orders', label: 'Bulk & Wholesale Orders', icon: ShoppingBag },
    { value: 'product-query', label: 'Product Questions', icon: MessageSquare },
    { value: 'retail-partnership', label: 'Retail Partnership', icon: Store },
    { value: 'collaboration', label: 'Collaboration Request', icon: Users },
    { value: 'general', label: 'General Inquiry', icon: Mail },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setResponseMessage('Thank you for reaching out! We\'ll get back to you within 24-48 hours.')
        setFormData({
          name: '',
          email: '',
          organization: '',
          inquiryType: '',
          budget: '',
          message: '',
        })
      } else {
        setStatus('error')
        setResponseMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setResponseMessage('Failed to send message. Please try emailing directly.')
    }

    setTimeout(() => {
      setStatus('idle')
      setResponseMessage('')
    }, 8000)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-forest to-forest-dark text-cream py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-16 left-1/4 w-96 h-96 bg-sage rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ochre rounded-full blur-3xl"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <Sprout className="h-4 w-4 text-ochre" />
            <span className="text-xs font-bold tracking-widest uppercase">We&apos;d Love to Hear From You</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            Say Hello to <span className="text-ochre">Healthier Days</span>
          </h1>
          <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto">
            Questions about our millets? Bulk orders or partnerships? Let&apos;s talk!
          </p>
        </div>
        <div className="wave-divider absolute bottom-0 left-0 right-0"></div>
      </section>

      {/* Contact Options */}
      <section className="section-padding bg-paper-texture">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-16 w-16 bg-terracotta/15 blob-2 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Mail className="h-8 w-8 text-terracotta" />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-charcoal mb-2">Email Us</h3>
              <a href="mailto:milletmountain23@gmail.com" className="text-terracotta hover:text-terracotta-dark font-semibold">
                milletmountain23@gmail.com
              </a>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-16 w-16 bg-sage/25 blob-3 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Linkedin className="h-8 w-8 text-forest" />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-charcoal mb-2">LinkedIn</h3>
              <a
                href="https://www.linkedin.com/in/millet-mountain-774657450"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest hover:text-forest-dark font-semibold"
              >
                Connect on LinkedIn
              </a>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-16 w-16 bg-ochre/20 blob-1 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Twitter className="h-8 w-8 text-ochre-dark" />
              </div>
              <h3 className="font-heading text-lg font-extrabold text-charcoal mb-2">Twitter</h3>
              <a
                href="https://x.com/zodiac_teller"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ochre-dark hover:text-terracotta font-semibold"
              >
                @zodiac_teller
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-paper-texture pt-0">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal mb-3">
              Send a <span className="text-terracotta">Message</span>
            </h2>
            <p className="text-lg text-charcoal/60">
              Fill out the form below and we&apos;ll respond within 24-48 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm">
            {/* Name & Email */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-charcoal/70 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-cream/60 border-2 border-[#EFE7DA] rounded-2xl focus:outline-none focus:border-terracotta focus:bg-white transition-colors text-charcoal"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-charcoal/70 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-cream/60 border-2 border-[#EFE7DA] rounded-2xl focus:outline-none focus:border-terracotta focus:bg-white transition-colors text-charcoal"
                />
              </div>
            </div>

            {/* Organization */}
            <div className="mb-6">
              <label htmlFor="organization" className="block text-sm font-bold text-charcoal/70 mb-2">
                Organization
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Company / store name (optional)"
                className="w-full px-4 py-3 bg-cream/60 border-2 border-[#EFE7DA] rounded-2xl focus:outline-none focus:border-terracotta focus:bg-white transition-colors text-charcoal"
              />
            </div>

            {/* Inquiry Type */}
            <div className="mb-6">
              <label htmlFor="inquiryType" className="block text-sm font-bold text-charcoal/70 mb-2">
                Type of Inquiry *
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-cream/60 border-2 border-[#EFE7DA] rounded-2xl focus:outline-none focus:border-terracotta focus:bg-white transition-colors text-charcoal"
              >
                <option value="">Select inquiry type</option>
                {inquiryTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget (for bulk orders) */}
            {formData.inquiryType === 'bulk-orders' && (
              <div className="mb-6">
                <label htmlFor="budget" className="block text-sm font-bold text-charcoal/70 mb-2">
                  Order Value Range (Optional)
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cream/60 border-2 border-[#EFE7DA] rounded-2xl focus:outline-none focus:border-terracotta focus:bg-white transition-colors text-charcoal"
                >
                  <option value="">Select order value range</option>
                  <option value="under-10k">Under ₹10,000</option>
                  <option value="10k-50k">₹10,000 – ₹50,000</option>
                  <option value="50k-1l">₹50,000 – ₹1 Lakh</option>
                  <option value="1l-5l">₹1 Lakh – ₹5 Lakh</option>
                  <option value="over-5l">Over ₹5 Lakh</option>
                </select>
              </div>
            )}

            {/* Message */}
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-bold text-charcoal/70 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell us how we can help..."
                className="w-full px-4 py-3 bg-cream/60 border-2 border-[#EFE7DA] rounded-2xl focus:outline-none focus:border-terracotta focus:bg-white transition-colors text-charcoal resize-none"
              />
            </div>

            {/* Status Message */}
            {responseMessage && (
              <div
                className={`mb-6 p-4 rounded-2xl ${
                  status === 'success'
                    ? 'bg-sage/15 text-forest border border-sage/40'
                    : 'bg-terracotta/10 text-terracotta-dark border border-terracotta/30'
                }`}
              >
                {responseMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-cream font-heading font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === 'loading' ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Message
                </>
              )}
            </button>

            <p className="text-sm text-charcoal/40 mt-4 text-center">
              By submitting this form, you agree to be contacted regarding your inquiry.
            </p>
          </form>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-paper-texture pt-0">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-sage/20 border border-sage/40 rounded-full px-4 py-1.5 mb-4">
              <Leaf className="h-4 w-4 text-forest" />
              <span className="text-xs font-bold tracking-widest uppercase text-forest">How We Can Help</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal">
              Grown With Care, <span className="text-forest">Shared With Joy</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white/80 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="h-14 w-14 bg-terracotta/15 blob-2 flex items-center justify-center mb-4">
                <ShoppingBag className="h-7 w-7 text-terracotta" />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-charcoal mb-3">Bulk & Wholesale Supply</h3>
              <p className="text-charcoal/60 mb-4">
                Stock your store or kitchen with our wholesome millet range at wholesale prices.
              </p>
              <ul className="space-y-2 text-charcoal/75">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Flours, flakes, cookies & more</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Flexible order quantities</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Consistent farm-fresh quality</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="h-14 w-14 bg-sage/25 blob-3 flex items-center justify-center mb-4">
                <Store className="h-7 w-7 text-forest" />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-charcoal mb-3">Retail Partnerships</h3>
              <p className="text-charcoal/60 mb-4">
                Bring Millet Mountain to your shelves and join the ancient-grain movement.
              </p>
              <ul className="space-y-2 text-charcoal/75">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Store & online retail programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Attractive partner margins</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Marketing & display support</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="h-14 w-14 bg-ochre/20 blob-1 flex items-center justify-center mb-4">
                <Gift className="h-7 w-7 text-ochre-dark" />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-charcoal mb-3">Corporate & Festive Gifting</h3>
              <p className="text-charcoal/60 mb-4">
                Thoughtful, healthy gift hampers for teams, clients and celebrations.
              </p>
              <ul className="space-y-2 text-charcoal/75">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Custom curated gift packs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Branded packaging options</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Bulk pricing for events</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="h-14 w-14 bg-forest/15 blob-2 flex items-center justify-center mb-4">
                <GraduationCap className="h-7 w-7 text-forest" />
              </div>
              <h3 className="font-heading text-xl font-extrabold text-charcoal mb-3">Nutrition Workshops</h3>
              <p className="text-charcoal/60 mb-4">
                Learn to cook and live the millet way with hands-on sessions and recipes.
              </p>
              <ul className="space-y-2 text-charcoal/75">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>School & community workshops</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Millet cooking masterclasses</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-forest mt-1 flex-shrink-0" />
                  <span>Ongoing recipe support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-forest-dark text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sage rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ochre rounded-full blur-3xl"></div>
        </div>
        <div className="container-custom text-center max-w-3xl mx-auto relative z-10 py-16 sm:py-20">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">
            Stay Updated with <span className="text-ochre">Millet Mountain</span>
          </h2>
          <p className="text-lg sm:text-xl text-cream/80 mb-8">
            Subscribe for seasonal recipes, new product drops and healthy living tips.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm variant="light" />
          </div>
        </div>
      </section>
    </>
  )
}
