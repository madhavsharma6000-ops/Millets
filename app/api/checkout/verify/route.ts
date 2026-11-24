import { NextRequest, NextResponse } from 'next/server'
import { recordPaidOrder, signatureMatches } from '@/lib/orders'
import { getRazorpayConfig } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      (await request.json().catch(() => null)) || {}

    const config = getRazorpayConfig()
    if (!config) {
      return NextResponse.json({ success: false, message: 'Payments are not configured' }, { status: 503 })
    }

    const fields = [razorpay_order_id, razorpay_payment_id, razorpay_signature]
    if (!fields.every((field) => typeof field === 'string' && field)) {
      return NextResponse.json({ success: false, message: 'Missing payment details' }, { status: 400 })
    }

    if (!signatureMatches(`${razorpay_order_id}|${razorpay_payment_id}`, razorpay_signature, config.keySecret)) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 })
    }

    const result = await recordPaidOrder(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    if (!result.order) {
      return NextResponse.json({ success: false, message: result.reason }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: { orderNumber: result.order.orderNumber },
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 500 })
  }
}
