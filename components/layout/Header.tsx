'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import KulluBand from '@/components/art/KulluBand'

const navigation = [
  { name: 'Shop', href: '/products' },
  { name: 'Healthy Tips & Blogs', href: '/blogs' },
  { name: 'Our Story', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname() || '/'
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <div className="bg-forest-dark text-cream text-center text-xs sm:text-sm font-semibold tracking-wide py-2.5 px-4">
        Free shipping on orders over ₹499 · Milled fresh every week
      </div>
      <KulluBand variant="steps" thread={2} />
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-[#EAE0CC]">
        <nav className="container-custom" aria-label="Main">
          <div className="flex justify-between items-center h-16 md:h-[84px] gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="w-11 h-11 md:w-[52px] md:h-[52px] rounded-full overflow-hidden border-2 border-[#EAE0CC] group-hover:border-ochre transition-colors bg-white">
                <Image src="/logo.png" alt="" width={104} height={104} className="w-full h-full object-cover" priority />
              </span>
              <span className="font-heading text-xl lg:text-2xl font-extrabold text-charcoal leading-none whitespace-nowrap">
                Millet Mountain
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-5 lg:gap-9">
              {navigation.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`text-[15px] font-semibold pb-1 border-b-2 whitespace-nowrap transition-colors ${
                      active
                        ? 'text-terracotta-dark border-terracotta'
                        : 'text-charcoal border-transparent hover:text-terracotta-dark'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <div className="hidden lg:block">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 h-11 px-5 bg-forest hover:bg-forest-dark text-cream rounded-full font-bold text-sm transition-colors"
              >
                <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
                Shop Now
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-full text-charcoal hover:bg-sage/20 transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-[#EAE0CC] pt-3">
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`px-4 py-3 rounded-xl font-semibold transition-colors ${
                      isActive(item.href) ? 'bg-[#F1EAD9] text-terracotta-dark' : 'text-charcoal hover:bg-sage/15'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 mx-4 inline-flex justify-center items-center gap-2 h-12 bg-forest text-cream rounded-full font-bold"
                >
                  <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                  Shop Now
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}

export default Header
