import { NextRequest, NextResponse } from 'next/server'
import { recordPaidOrder, signatureMatches } from '@/lib/orders'

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !keySecret) {
      return NextResponse.json({ success: false, message: 'Payments are not configured' }, { status: 503 })
    }

    if (
      typeof razorpay_order_id !== 'string' ||
      typeof razorpay_payment_id !== 'string' ||
      !signatureMatches(`${razorpay_order_id}|${razorpay_payment_id}`, razorpay_signature, keySecret)
    ) {
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
