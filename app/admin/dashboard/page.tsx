'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  FileText,
  IndianRupee,
  Leaf,
  Package,
  PenLine,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Users,
  ExternalLink,
  Trophy,
} from 'lucide-react'

interface DashboardStats {
  blogs: { total: number; published: number; drafts: number }
  products: { total: number; active: number; inactive: number }
  orders: { total: number; completed: number; pending: number }
  revenue: {
    total: number
    byMonth: { _id: { year: number; month: number }; revenue: number; orders: number }[]
  }
  recentOrders: {
    orderNumber: string
    customerName?: string
    productName: string
    amount: number
    createdAt: string
  }[]
  topProducts: { _id: string; productName: string; sales: number; revenue: number }[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const inr = (n: number) => `₹${Number(n || 0).toLocaleString('en-IN')}`

export default function AdminDashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        if (response.ok) setStats(data)
        else setError(true)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta" />
      </div>
    )
  }

  const firstName = (session?.user?.name || '').split(' ')[0] || 'there'
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const s: DashboardStats = stats || {
    blogs: { total: 0, published: 0, drafts: 0 },
    products: { total: 0, active: 0, inactive: 0 },
    orders: { total: 0, completed: 0, pending: 0 },
    revenue: { total: 0, byMonth: [] },
    recentOrders: [],
    topProducts: [],
  }

  // Oldest → newest, last 6 months that have sales
  const months = [...s.revenue.byMonth].slice(0, 6).reverse()
  const maxRevenue = Math.max(1, ...months.map((m) => m.revenue))

  const ribbon = [
    `${inr(s.revenue.total)} earned`,
    `${s.orders.total} orders`,
    `${s.orders.pending} pending`,
    `${s.products.active} products live`,
    `${s.blogs.published} stories published`,
    `${s.blogs.drafts} drafts`,
  ]

  return (
    <div className="text-charcoal">
      {/* ===== Hero ===== */}
      <section className="px-4 sm:px-6 lg:px-8 [&>*]:max-w-7xl [&>*]:mx-auto pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="grid xl:grid-cols-[1.25fr_1fr] gap-10 items-center">
          <div className="text-center xl:text-left">
            <div className="inline-flex items-center gap-2 bg-[#E4ECDF] border border-[#C9D8C3] rounded-full px-3.5 py-1.5 mb-5">
              <Leaf className="h-3.5 w-3.5 text-forest-dark" aria-hidden="true" />
              <span className="text-xs font-bold text-forest-dark tracking-[0.08em] uppercase">Millet Mountain HQ</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl xl:text-[60px] font-extrabold leading-[1.08] mb-6 text-balance">
              {greeting}, <span className="inline-block text-terracotta border-b-[5px] border-ochre pb-1">{firstName}</span>
            </h1>

            <p className="text-sm font-bold tracking-[0.06em] uppercase text-forest mb-3">
              Orders · Products · Stories
            </p>
            <p className="text-base md:text-lg text-[#5A4E48] leading-relaxed mb-8 max-w-xl mx-auto xl:mx-0">
              Here is how the mountain is doing today. Keep the pantry stocked and the journal fresh.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center xl:justify-start">
              <Link
                href="/admin/products/new"
                className="group inline-flex items-center justify-center gap-2 min-h-[52px] px-7 bg-terracotta hover:bg-terracotta-dark text-cream rounded-full font-bold transition-colors"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                Add Product
              </Link>
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-7 border-2 border-forest text-forest rounded-full font-bold hover:bg-forest hover:text-cream transition-colors"
              >
                <PenLine className="h-5 w-5" aria-hidden="true" />
                Write a Story
              </Link>
            </div>

            {error && (
              <p className="mt-6 text-sm font-semibold text-terracotta-dark">
                Couldn&apos;t load the latest numbers. Refresh the page to try again.
              </p>
            )}
          </div>

          {/* Hero visual: revenue card */}
          <div className="relative mx-auto w-full max-w-md h-[340px] md:h-[380px]">
            <div className="absolute inset-0 bg-[#F1EAD9] border-2 border-[#EAE0CC] rounded-[40px] rotate-2" aria-hidden="true" />
            <div className="absolute inset-0 bg-[#EFE5D2] rounded-[40px] p-7 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-12 h-12 rounded-full overflow-hidden border-[3px] border-white shadow-md bg-white flex-shrink-0">
                  <Image src="/logo.png" alt="" width={96} height={96} className="w-full h-full object-cover" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.08em] uppercase text-terracotta-dark">Total revenue</p>
                  <p className="font-heading text-3xl md:text-4xl font-extrabold text-forest leading-none">{inr(s.revenue.total)}</p>
                </div>
              </div>

              {months.length > 0 ? (
                <div className="flex-1 flex items-end gap-2.5" role="img" aria-label="Revenue for recent months">
                  {months.map((m) => (
                    <div key={`${m._id.year}-${m._id.month}`} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] font-bold text-[#5A4E48]">{inr(m.revenue)}</span>
                      <div
                        className="w-full rounded-t-xl bg-terracotta"
                        style={{ height: `${Math.max(8, (m.revenue / maxRevenue) * 100)}%` }}
                      />
                      <span className="text-xs font-bold text-forest-dark">{MONTHS[m._id.month - 1]}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 rounded-3xl border-2 border-dashed border-[#D9CDB8] flex items-center justify-center text-center px-6 text-[#5A4E48] font-semibold">
                  Your monthly sales will show here after the first completed order.
                </div>
              )}
            </div>

            <div className="absolute -top-3 -left-2 md:-left-5 -rotate-6 bg-forest text-cream rounded-[18px] px-4 py-3 shadow-lg animate-floaty [animation-delay:1.2s]">
              <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-cream/70">Orders</p>
              <p className="font-heading text-2xl font-extrabold leading-none">{s.orders.total}</p>
            </div>
            <div className="absolute -bottom-4 -right-1 md:-right-4 rotate-6 bg-ochre text-charcoal rounded-[18px] px-4 py-3 shadow-lg animate-floaty [animation-delay:2.4s]">
              <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-charcoal/60">Live products</p>
              <p className="font-heading text-2xl font-extrabold leading-none">{s.products.active}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Ribbon ===== */}
      <section className="bg-forest text-cream py-3.5 overflow-hidden" aria-label="Quick summary">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8 pr-8 font-heading font-bold text-sm tracking-[0.14em] uppercase" aria-hidden={copy === 1}>
              {ribbon.map((item) => (
                <span key={item} className="inline-flex items-center gap-8">
                  {item}
                  <Leaf className="h-4 w-4 text-ochre" aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ===== At a glance ===== */}
      <section className="px-4 sm:px-6 lg:px-8 [&>*]:max-w-7xl [&>*]:mx-auto py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[13px] font-bold tracking-[0.1em] uppercase text-terracotta-dark mb-3">At a Glance</p>
          <h2 className="font-heading text-3xl md:text-[44px] font-extrabold leading-[1.05] text-balance">
            Your Business, <span className="text-forest">in Numbers</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
          <StatCard href="/admin/orders" icon={IndianRupee} tint="bg-[#F7E6C8]" iconColor="text-terracotta-dark" label="Revenue" value={inr(s.revenue.total)} note="From completed orders" />
          <StatCard href="/admin/orders" icon={ShoppingCart} label="Orders" value={s.orders.total} note={`${s.orders.completed} completed · ${s.orders.pending} pending`} featured />
          <StatCard href="/admin/products" icon={Package} tint="bg-[#E4ECDF]" iconColor="text-forest" label="Products" value={s.products.total} note={`${s.products.active} live · ${s.products.inactive} hidden`} />
          <StatCard href="/admin/blogs" icon={FileText} tint="bg-[#F6DED2]" iconColor="text-terracotta-dark" label="Stories" value={s.blogs.total} note={`${s.blogs.published} published · ${s.blogs.drafts} drafts`} />
        </div>
      </section>

      {/* ===== Orders & top products ===== */}
      <section className="px-4 sm:px-6 lg:px-8 [&>*]:max-w-7xl [&>*]:mx-auto py-14 md:py-20 bg-[#F1EAD9]">
        <div className="flex flex-wrap justify-between items-end gap-5 mb-8 md:mb-10">
          <div>
            <p className="text-[13px] font-bold tracking-[0.1em] uppercase text-terracotta-dark mb-3">From the Counter</p>
            <h2 className="font-heading text-3xl md:text-[44px] font-extrabold leading-[1.05]">
              Recent <span className="text-terracotta">Orders</span>
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-full border-2 border-charcoal text-charcoal font-bold hover:bg-charcoal hover:text-cream transition-colors"
          >
            View all orders
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
          <div className="bg-cream border-2 border-[#EAE0CC] rounded-[28px] p-4 sm:p-6">
            {s.recentOrders.length > 0 ? (
              <ul className="divide-y divide-[#EAE0CC]">
                {s.recentOrders.slice(0, 6).map((order) => (
                  <li key={order.orderNumber} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-2xl bg-[#E4ECDF] flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="h-[18px] w-[18px] text-forest" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-charcoal truncate">{order.productName}</p>
                        <p className="text-sm text-[#6B5F58] truncate">
                          {order.customerName || 'Guest'} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-heading text-lg font-extrabold text-forest">{inr(order.amount)}</p>
                      <p className="text-xs text-[#6B5F58]">{order.orderNumber}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={ShoppingCart} title="No orders yet" text="Completed orders will appear here as soon as customers check out." />
            )}
          </div>

          <div className="bg-forest text-cream rounded-[28px] p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-11 h-11 rounded-[16px] bg-cream/15 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-ochre-light" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-2xl font-bold">Best Sellers</h3>
            </div>
            {s.topProducts.length > 0 ? (
              <ol className="space-y-3">
                {s.topProducts.map((p, i) => (
                  <li key={p._id} className="flex items-center gap-3 bg-cream/10 rounded-2xl px-4 py-3">
                    <span className="font-heading text-xl font-extrabold text-ochre-light w-6">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate">{p.productName}</p>
                      <p className="text-sm text-[#E8EDE4]">{p.sales} sold · {inr(p.revenue)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-[#E8EDE4] leading-relaxed">
                Your top products will be ranked here once orders start coming in.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ===== Manage ===== */}
      <section className="px-4 sm:px-6 lg:px-8 [&>*]:max-w-7xl [&>*]:mx-auto py-14 md:py-20">
        <div className="flex flex-wrap justify-between items-end gap-5 mb-8 md:mb-10">
          <div>
            <p className="text-[13px] font-bold tracking-[0.1em] uppercase text-terracotta-dark mb-3">Shortcuts</p>
            <h2 className="font-heading text-3xl md:text-[44px] font-extrabold leading-[1.05]">Manage the Mountain</h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
          <ManageCard href="/admin/orders" icon={ShoppingCart} tint="bg-[#F6DED2]" iconColor="text-terracotta-dark" title="Orders" text="Track purchases and payment status." />
          <ManageCard href="/admin/customers" icon={Users} tint="bg-[#E4ECDF]" iconColor="text-forest" title="Customers" text="See who is buying from you." />
          <ManageCard href="/admin/products" icon={ShoppingBag} tint="bg-[#F7E6C8]" iconColor="text-ochre-dark" title="Products" text="Add, price and update the shelf." />
          <ManageCard href="/admin/blogs" icon={FileText} tint="bg-[#E4ECDF]" iconColor="text-forest" title="Journal" text="Write and publish stories." />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-4 sm:px-6 lg:px-8 [&>*]:max-w-7xl [&>*]:mx-auto pb-14 md:pb-20">
        <div className="bg-terracotta text-cream rounded-[36px] p-8 md:p-12 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex-[1_1_320px]">
            <h2 className="font-heading text-3xl md:text-[38px] font-extrabold leading-[1.05] mb-2">
              See what your customers see
            </h2>
            <p className="text-[17px] leading-relaxed text-[#FCEDE5]">
              Open the live store to check your latest products and stories.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 min-h-[52px] px-7 rounded-full bg-cream text-terracotta-dark font-bold hover:bg-white transition-colors"
          >
            View the store
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  href,
  icon: Icon,
  label,
  value,
  note,
  tint = 'bg-[#F7E6C8]',
  iconColor = 'text-terracotta-dark',
  featured = false,
}: {
  href: string
  icon: React.ElementType
  label: string
  value: string | number
  note: string
  tint?: string
  iconColor?: string
  featured?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group rounded-[28px] p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured ? 'bg-forest text-cream' : 'bg-white border-2 border-[#EFE7DA]'
      }`}
    >
      <div className={`w-14 h-14 mx-auto mb-4 rounded-[20px] flex items-center justify-center ${featured ? 'bg-cream/15' : tint}`}>
        <Icon className={`h-7 w-7 ${featured ? 'text-ochre-light' : iconColor}`} aria-hidden="true" />
      </div>
      <p className={`text-xs font-bold tracking-[0.1em] uppercase mb-1.5 ${featured ? 'text-cream/70' : 'text-terracotta-dark'}`}>{label}</p>
      <p className={`font-heading text-4xl font-extrabold leading-none mb-2 ${featured ? '' : 'text-charcoal'}`}>{value}</p>
      <p className={`text-sm ${featured ? 'text-[#E8EDE4]' : 'text-[#5A4E48]'}`}>{note}</p>
    </Link>
  )
}

function ManageCard({
  href,
  icon: Icon,
  title,
  text,
  tint,
  iconColor,
}: {
  href: string
  icon: React.ElementType
  title: string
  text: string
  tint: string
  iconColor: string
}) {
  return (
    <Link
      href={href}
      className="group bg-cream border-2 border-[#EAE0CC] rounded-[28px] overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className={`h-28 ${tint} flex items-center justify-center`}>
        <Icon className={`h-10 w-10 ${iconColor} group-hover:scale-110 transition-transform`} aria-hidden="true" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-xl font-bold mb-1.5 group-hover:text-terracotta-dark transition-colors">{title}</h3>
        <p className="text-sm text-[#5A4E48] leading-relaxed mb-4 flex-1">{text}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-terracotta-dark">
          Open <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

function EmptyState({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="py-10 text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-[20px] bg-[#E4ECDF] flex items-center justify-center">
        <Icon className="h-7 w-7 text-forest" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-xl font-bold mb-1">{title}</h3>
      <p className="text-[#5A4E48] max-w-sm mx-auto">{text}</p>
    </div>
  )
}
