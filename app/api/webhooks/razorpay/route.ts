import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { recordPaidOrder, signatureMatches } from '@/lib/orders'

// Razorpay retries any event that doesn't get a 2xx, so every handler must be safe to repeat.
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('❌ Webhook: RAZORPAY_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    if (!signatureMatches(body, signature, webhookSecret)) {
      console.error('❌ Webhook: Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    const event = JSON.parse(body)

    switch (event.event) {
      case 'payment.captured':
      case 'order.paid':
        await handlePaid(event.payload.payment?.entity)
        break
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break
      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity)
        break
      default:
        console.log('ℹ️ Unhandled event type:', event.event)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Creates the order if the customer closed the page before checkout could record it
async function handlePaid(payment: any) {
  if (!payment?.id || !payment.order_id) return

  const result = await recordPaidOrder(payment.order_id, payment.id)
  if (!result.order) {
    console.log('ℹ️ Webhook: payment ignored:', payment.id, result.reason)
    return
  }

  // Never turns a refunded order back into a paid one
  await prisma.order.updateMany({
    where: { razorpayPaymentId: payment.id, paymentStatus: { in: ['pending', 'failed'] } },
    data: { paymentStatus: 'completed' },
  })
}

async function handlePaymentFailed(payment: any) {
  // Events can arrive late: never overwrite a completed or refunded order
  await prisma.order.updateMany({
    where: { razorpayPaymentId: payment.id, paymentStatus: 'pending' },
    data: { paymentStatus: 'failed' },
  })
}

async function handleRefundCreated(refund: any) {
  await prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { razorpayPaymentId: refund.payment_id, paymentStatus: { not: 'refunded' } },
      data: { paymentStatus: 'refunded' },
    })
    if (count === 0) return // unknown payment, or a repeat of a refund already handled

    const order = await tx.order.findUnique({ where: { razorpayPaymentId: refund.payment_id } })
    if (order?.productId) {
      await tx.product.updateMany({ where: { id: order.productId }, data: { purchaseCount: { decrement: 1 } } })
    }
  })
}
