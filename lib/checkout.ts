// Delivery details: shared by the checkout form and the server.

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
]

export type DeliveryDetails = {
  name: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  pincode: string
}

export const emptyDeliveryDetails: DeliveryDetails = {
  name: '', email: '', phone: '', address1: '', address2: '', city: '', state: '', pincode: '',
}

// Razorpay allows 256 characters per stored note
const maxLength: Record<keyof DeliveryDetails, number> = { name: 100, email: 200, phone: 20, address1: 200, address2: 200, city: 80, state: 80, pincode: 10 }

export function validateDeliveryDetails(input: any) {
  const values = { ...emptyDeliveryDetails }
  const errors: Partial<Record<keyof DeliveryDetails, string>> = {}

  for (const key of Object.keys(values) as (keyof DeliveryDetails)[]) {
    const raw = input?.[key]
    values[key] = typeof raw === 'string' ? raw.replace(/\s+/g, ' ').trim() : ''
    if (values[key].length > maxLength[key]) errors[key] = 'This is too long'
  }
  values.phone = values.phone.replace(/[\s-]/g, '').replace(/^(\+91|91(?=\d{10}$)|0(?=\d{10}$))/, '')
  values.pincode = values.pincode.replace(/\s/g, '')

  if (values.name.length < 2) errors.name = 'Please enter your full name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Please enter a valid email'
  if (!/^[6-9]\d{9}$/.test(values.phone)) errors.phone = 'Please enter a valid 10-digit mobile number'
  if (values.address1.length < 5) errors.address1 = 'Please enter your house number and street'
  if (values.city.length < 2) errors.city = 'Please enter your city or town'
  if (!INDIAN_STATES.includes(values.state)) errors.state = 'Please select your state'
  if (!/^[1-9]\d{5}$/.test(values.pincode)) errors.pincode = 'Please enter a valid 6-digit PIN code'

  return { values, errors, valid: Object.keys(errors).length === 0 }
}
