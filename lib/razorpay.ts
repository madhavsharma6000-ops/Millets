import Razorpay from 'razorpay'

// Razorpay's smallest allowed payment
export const MIN_AMOUNT_PAISE = 100

/** Server only. Returns null when payments aren't configured. */
export function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) return null
  return { keyId, keySecret, client: new Razorpay({ key_id: keyId, key_secret: keySecret }) }
}

/** True when Razorpay rejected our API keys. */
export function isRazorpayAuthError(error: any) {
  return error?.statusCode === 401
}
