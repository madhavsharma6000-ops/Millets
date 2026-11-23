'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

interface NewsletterFormProps {
  variant?: 'light' | 'dark'
}

export default function NewsletterForm({ variant = 'dark' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Successfully subscribed!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }

    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  // Both variants sit on dark/coloured backgrounds (footer, newsletter band).
  const inputClass =
    'w-full min-h-[52px] px-4 rounded-full bg-cream border-2 border-transparent text-charcoal placeholder-charcoal/50 focus:border-ochre focus:outline-none'

  const buttonClass = variant === 'light'
    ? 'w-full sm:w-auto min-h-[52px] px-7 bg-terracotta hover:bg-terracotta-dark text-cream rounded-full font-bold transition-colors duration-200'
    : 'w-full sm:w-auto min-h-[52px] px-7 bg-charcoal hover:bg-black text-cream rounded-full font-bold transition-colors duration-200'

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal/40" aria-hidden="true" />
          <input
            type="email"
            aria-label="Email address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`${inputClass} pl-11`}
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={buttonClass}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {message && (
        <p role="status" className="mt-3 text-sm font-semibold text-cream">
          {message}
        </p>
      )}
    </div>
  )
}
