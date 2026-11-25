import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { shippingFee, validateDeliveryDetails } from '@/lib/checkout'
import { getRazorpayConfig, isRazorpayAuthError, MIN_AMOUNT_PAISE } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  const config = getRazorpayConfig()
  if (!config) {
    return NextResponse.json(
      { message: 'Online payments are not available yet. Please contact us to order.' },
      { status: 503 }
    )
  }

  try {
    const { keyId, client: razorpay } = config
    const body = await request.json().catch(() => null)
    const productId = body?.productId

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

    if (!(Math.round(amount * 100) >= MIN_AMOUNT_PAISE)) {
      return NextResponse.json({ message: 'This product cannot be purchased online' }, { status: 400 })
    }

    const shipping = shippingFee(product.price, product.currency)
    const amountInPaise = Math.round((amount + shipping) * 100)
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
        shippingFee: String(shipping),
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
        key: keyId,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('❌ Razorpay order creation error:', error)
    if (isRazorpayAuthError(error)) {
      return NextResponse.json(
        { message: 'Payments are temporarily unavailable. Please contact us to order.' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    )
  }
}
