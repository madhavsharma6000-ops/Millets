import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, FileText, Package } from 'lucide-react'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Your Order',
  robots: { index: false, follow: false },
}

export default async function OrderPage({ params }: { params: { orderNumber: string } }) {
  // This page opens with just the link, so it only shows the city and PIN code, not the full address.
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    select: {
      orderNumber: true, productName: true, amount: true, currency: true, paymentStatus: true,
      createdAt: true, shippingCity: true, shippingPincode: true,
    },
  })

  if (!order) notFound()

  const paid = order.paymentStatus === 'completed'
  const heading = paid ? 'Thank you for your order!' : order.paymentStatus === 'refunded' ? 'Order refunded' : 'Payment not completed'

  return (
    <div className="min-h-screen bg-cream text-charcoal py-14 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          {paid ? (
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          ) : (
            <Package className="h-16 w-16 text-terracotta mx-auto mb-4" />
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{heading}</h1>
          {paid && <p className="text-[#5A4E48]">Your payment was successful and we have received your order.</p>}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <dl className="space-y-4">
            {[
              ['Order number', order.orderNumber],
              ['Order date', order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })],
              ['Product', order.productName],
              ['Amount', `${order.currency === 'USD' ? '$' : '₹'}${order.amount.toFixed(2)}`],
              ...(order.shippingCity ? [['Delivering to', `${order.shippingCity} – ${order.shippingPincode}`]] : []),
            ].map(([label, value]) => (
              <div key={label} className="flex flex-wrap justify-between gap-x-6 gap-y-1">
                <dt className="text-[#6B5F58]">{label}</dt>
                <dd className="font-semibold break-all">{value}</dd>
              </div>
            ))}
          </dl>

          {paid && (
            <Link href={`/receipt/${order.orderNumber}`} className="btn-primary mt-8 w-full inline-flex items-center justify-center gap-2">
              <FileText className="h-5 w-5" />
              View receipt
            </Link>
          )}
        </div>

        <p className="text-center text-[#6B5F58] mt-8">
          Need to change something? <Link href="/contact" className="text-terracotta font-semibold">Contact us</Link> with your order number.
        </p>
      </div>
    </div>
  )
}
