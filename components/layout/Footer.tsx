'use client'

import Link from 'next/link'
import { Leaf, Instagram, Linkedin, Youtube, Mail } from 'lucide-react'
import KulluBand from '@/components/art/KulluBand'
import NewsletterForm from '@/components/forms/NewsletterForm'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const shopLinks = [
    { name: 'All Products', href: '/products' },
    { name: 'Best Sellers', href: '/products' },
    { name: 'New Arrivals', href: '/products' },
    { name: 'Gift Packs', href: '/products' },
  ]

  const companyLinks = [
    { name: 'Our Story', href: '/about' },
    { name: 'Health Benefits', href: '/#features' },
    { name: 'Healthy Tips & Blogs', href: '/blogs' },
    { name: 'Contact Us', href: '/contact' },
  ]

  const supportLinks = [
    { name: 'Shipping & Delivery', href: '/terms' },
    { name: 'Returns & Refunds', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ]

  const socials = [
    { icon: Instagram, href: 'https://www.instagram.com/millet_mountain_', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/millet-mountain-774657450', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://www.youtube.com/channel/UCBRxhOWknVLI9s5wdi7RIXw', label: 'YouTube' },
    { icon: Mail, href: 'mailto:milletmountain23@gmail.com', label: 'Email' },
  ]

  return (
    <footer className="bg-forest-dark text-cream">
      {/* Wave top edge */}
      <div className="bg-cream">
        <svg className="wave-divider" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,40 C180,70 360,5 540,25 C720,45 900,65 1080,45 C1260,25 1380,10 1440,30 L1440,70 L0,70 Z"
            fill="#2A3B30"
          />
        </svg>
      </div>

      <div className="container-custom px-4 pt-6 pb-10">
        {/* Top row: philosophy + newsletter */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pb-12 border-b border-cream/15">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-11 h-11 rounded-full bg-sage flex items-center justify-center ring-2 ring-ochre/50">
                <Leaf className="h-6 w-6 text-forest-dark" />
              </span>
              <span className="font-heading text-2xl font-extrabold">
                Millet <span className="text-ochre">Mountain</span>
              </span>
            </div>
            <p className="text-cream/80 leading-relaxed max-w-md">
              Rooted in the hills, guided by tradition. We bring ancient grains to modern tables —
              honest food that nourishes people and planet, one wholesome bite at a time.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  {...(social.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="w-10 h-10 rounded-full bg-cream/10 hover:bg-ochre flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="h-5 w-5 text-cream" />
                </a>
              ))}
            </div>
            <a
              href="mailto:milletmountain23@gmail.com"
              className="inline-flex items-center gap-2 mt-4 text-cream/80 hover:text-ochre font-semibold transition-colors"
            >
              milletmountain23@gmail.com
            </a>
          </div>

          <div className="lg:justify-self-end w-full max-w-md">
            <h3 className="font-heading text-xl font-bold mb-2 flex items-center gap-2">
              <Mail className="h-5 w-5 text-ochre" /> Join the Mountain Club
            </h3>
            <p className="text-cream/70 text-sm mb-4">
              Recipes, harvest stories, and early access to new batches. No spam, ever.
            </p>
            <NewsletterForm variant="light" />
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-10">
          <div>
            <h4 className="font-heading font-bold text-ochre mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-cream/75 hover:text-ochre transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-ochre mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-cream/75 hover:text-ochre transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-heading font-bold text-ochre mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-cream/75 hover:text-ochre transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/15 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-cream/60 text-sm">
            © {currentYear} Millet Mountain. All rights reserved.
          </p>
          <p className="text-cream/50 text-xs italic">
            Grown with care in the hills · Taste and Health in a Bite
          </p>
        </div>
      </div>
      <KulluBand variant="diamond" thread={2} />
    </footer>
  )
}

export default Footer
