'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const name = session?.user?.name || 'Admin'
  const initial = name.trim().charAt(0).toUpperCase() || 'A'

  const handleSignOut = async () => {
    setShowUserMenu(false)

    try {
      // Clear session without automatic redirect
      await signOut({ redirect: false })

      // Manually redirect to login page
      router.push('/admin/login')

      // Force a page refresh to clear all state
      setTimeout(() => {
        window.location.href = '/admin/login'
      }, 100)
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback: force redirect
      window.location.href = '/admin/login'
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:h-[72px] bg-cream/95 backdrop-blur-md border-b border-[#EAE0CC] z-50">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full text-charcoal hover:bg-sage/20 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <span className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 border-[#EAE0CC] group-hover:border-ochre transition-colors bg-white flex-shrink-0">
              <Image src="/logo.png" alt="" width={88} height={88} className="w-full h-full object-cover" priority />
            </span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-heading text-xl font-extrabold text-charcoal">Millet Mountain</span>
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-terracotta-dark mt-1">Admin</span>
            </span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-2 h-11 px-5 border-2 border-forest text-forest rounded-full font-bold text-sm hover:bg-forest hover:text-cream transition-colors"
          >
            View store
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-1.5 pr-1.5 sm:pr-4 py-1.5 rounded-full hover:bg-[#F1EAD9] transition-colors"
              aria-haspopup="menu"
              aria-expanded={showUserMenu}
            >
              <span className="h-9 w-9 bg-forest text-cream rounded-full flex items-center justify-center font-heading font-extrabold">
                {initial}
              </span>
              <span className="hidden sm:block text-left">
                <span className="block text-sm font-bold text-charcoal">{name}</span>
                <span className="block text-xs text-[#6B5F58] capitalize">{session?.user?.role || 'admin'}</span>
              </span>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <>
                {/* Backdrop for closing menu */}
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-60 bg-cream rounded-3xl shadow-xl border-2 border-[#EAE0CC] p-2 z-50" role="menu">
                  <div className="px-4 py-3 border-b border-[#EAE0CC] mb-1">
                    <p className="text-sm font-bold text-charcoal">{name}</p>
                    <p className="text-xs text-[#6B5F58] truncate">{session?.user?.email}</p>
                  </div>
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setShowUserMenu(false)}
                    className="md:hidden w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-[#F1EAD9] rounded-2xl transition-colors"
                    role="menuitem"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View store
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-terracotta-dark hover:bg-[#F6DED2] rounded-2xl transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
