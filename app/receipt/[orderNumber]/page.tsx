import { notFound } from 'next/navigation'
import { prisma, serializeProduct } from '@/lib/db'
import ReceiptView from '@/components/receipt/ReceiptView'

interface ReceiptPageProps {
  params: {
    orderNumber: string
  }
}

async function getOrderDetails(orderNumber: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { product: true },
    })
    
    if (!order) return null

    return {
      // Only what the receipt shows is sent to the browser
      order: {
        _id: order.id,
        orderNumber: order.orderNumber,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        customerEmail: order.customerEmail || '',
        customerName: order.customerName || undefined,
        productName: order.productName,
        amount: order.amount,
        currency: order.currency,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt.toISOString(),
      },
      product: order.product ? serializeProduct(order.product, { includeFileUrl: false }) : null,
    }
  } catch (error) {
    console.error('Error fetching order details:', error)
    return null
  }
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const data = await getOrderDetails(params.orderNumber)

  if (!data || !data.order) {
    notFound()
  }

  return <ReceiptView order={data.order} product={data.product} />
}
