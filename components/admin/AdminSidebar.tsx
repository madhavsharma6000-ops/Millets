'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, ShoppingBag, ShoppingCart, Users, Leaf } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Blogs', href: '/admin/blogs', icon: FileText },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
]

interface AdminSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-charcoal/50 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-forest-dark text-cream z-40 transform transition-transform duration-300 pt-16 md:pt-[72px] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="h-full flex flex-col px-4 py-6" aria-label="Admin">
          <p className="px-3 mb-4 text-[11px] font-bold tracking-[0.12em] uppercase text-cream/50">Navigation</p>

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold text-[15px] transition-colors ${
                    isActive ? 'bg-terracotta text-cream' : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-auto rounded-3xl bg-cream/10 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Leaf className="h-4 w-4 text-ochre" aria-hidden="true" />
              <p className="font-heading font-bold">Millet Mountain</p>
            </div>
            <p className="text-xs text-cream/70 leading-relaxed">Taste and health in a bite.</p>
          </div>
        </nav>
      </aside>
    </>
  )
}
