import crypto from 'crypto'
import Razorpay from 'razorpay'
import { formatShippingAddress, prisma } from '@/lib/db'
import { sendOrderConfirmationEmail } from '@/lib/email'

export function signatureMatches(payload: string, signature: unknown, secret: string) {
  const expected = Buffer.from(crypto.createHmac('sha256', secret).update(payload).digest('hex'))
  const received = Buffer.from(String(signature || ''))
  return expected.length === received.length && crypto.timingSafeEqual(expected, received)
}

type Result =
  | { order: { orderNumber: string }; created: boolean }
  | { order: null; reason: string }

/**
 * Records a paid order. Called by both the checkout page and the Razorpay webhook, in any
 * order and any number of times: each payment creates exactly one order.
 * Everything is read from Razorpay, never from the caller.
 */
export async function recordPaidOrder(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature = ''
): Promise<Result> {
  const findExisting = () => prisma.order.findUnique({ where: { razorpayPaymentId } })

  const existing = await findExisting()
  if (existing) return { order: existing, created: false }

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
  const [rzpOrder, payment] = await Promise.all([
    razorpay.orders.fetch(razorpayOrderId),
    razorpay.payments.fetch(razorpayPaymentId),
  ])

  if (
    payment.order_id !== razorpayOrderId ||
    !['authorized', 'captured'].includes(payment.status) ||
    Number(payment.amount) < Number(rzpOrder.amount) ||
    payment.currency !== rzpOrder.currency
  ) {
    return { order: null, reason: 'Payment is not complete' }
  }

  const notes = (rzpOrder.notes || {}) as Record<string, unknown>
  const note = (key: string) => (notes[key] ? String(notes[key]) : null)
  const productId = note('productId')
  if (!productId) return { order: null, reason: 'This payment is not from the website checkout' }

  // If the product was deleted after payment, still record the order
  const product = await prisma.product.findUnique({ where: { id: productId } })
  const customerEmail = note('customerEmail')
  const customerName = note('customerName')
  const productName = product?.name || note('productName') || 'Deleted product'
  const amount = Number(rzpOrder.amount) / 100
  const currency = rzpOrder.currency

  let order
  try {
    order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          customerEmail,
          customerName,
          customerPhone: note('customerPhone'),
          shippingAddress1: note('shippingAddress1'),
          shippingAddress2: note('shippingAddress2'),
          shippingCity: note('shippingCity'),
          shippingState: note('shippingState'),
          shippingPincode: note('shippingPincode'),
          productId: product?.id ?? null,
          productName,
          amount,
          currency,
          paymentStatus: 'completed',
          downloadUrl: '',
        },
      })
      if (product) {
        await tx.product.updateMany({ where: { id: product.id }, data: { purchaseCount: { increment: 1 } } })
      }
      return created
    })
  } catch (error: any) {
    // The checkout page and the webhook arrived together: use the order the other one created
    if (error.code === 'P2002') {
      const other = await findExisting()
      if (other) return { order: other, created: false }
    }
    throw error
  }

  console.log('✅ Order created:', order.orderNumber)

  // Only whoever created the order sends the email, so the customer gets one
  if (customerEmail) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      await sendOrderConfirmationEmail({
        to: customerEmail,
        customerName: customerName || 'Valued Customer',
        orderNumber: order.orderNumber,
        productName,
        amount,
        currency,
        shippingAddress: formatShippingAddress(order),
        orderUrl: `${siteUrl}/order/${order.orderNumber}`,
        receiptUrl: `${siteUrl}/receipt/${order.orderNumber}`,
      })
    } catch (error) {
      console.error('Error sending confirmation email:', error)
    }
  }

  return { order, created: true }
}
