import Razorpay from 'razorpay'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateDeliveryDetails } from '@/lib/checkout'

export async function POST(request: NextRequest) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { message: 'Online payments are not available yet. Please contact us to order.' },
      { status: 503 }
    )
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const body = await request.json()
    const { productId } = body

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 })
    }

    const { values: delivery, errors, valid } = validateDeliveryDetails(body?.delivery)
    if (!valid) {
      return NextResponse.json({ message: 'Please check your delivery details', errors }, { status: 400 })
    }

    // The price always comes from the database, never from the browser
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product || product.status !== 'active') {
      return NextResponse.json({ message: 'This product is not available' }, { status: 404 })
    }

    let amount = product.price
    let currency = product.currency

    const isTestMode = keyId.startsWith('rzp_test_')
    if (isTestMode && currency !== 'INR') {
      console.log('⚠️ Test mode detected - converting', currency, 'to INR')
      if (currency === 'USD') amount = Math.round(amount * 83)
      currency = 'INR'
    }

    if (!(amount > 0)) {
      return NextResponse.json({ message: 'This product cannot be purchased online' }, { status: 400 })
    }

    const amountInPaise = Math.round(amount * 100)
    const options = {
      amount: amountInPaise,
      currency,
      receipt: `receipt_${Date.now()}`,
      // Saved with the payment, so the address can't change or go missing afterwards
      notes: {
        productId,
        productName: product.name.slice(0, 200),
        customerName: delivery.name,
        customerEmail: delivery.email,
        customerPhone: delivery.phone,
        shippingAddress1: delivery.address1,
        shippingAddress2: delivery.address2,
        shippingCity: delivery.city,
        shippingState: delivery.state,
        shippingPincode: delivery.pincode,
      },
    }

    const order = await razorpay.orders.create(options)
    console.log('✅ Razorpay order created:', order.id)

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Razorpay order creation error:', error)
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    )
  }
}
