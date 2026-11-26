import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CreditCard, Leaf, Truck } from 'lucide-react'
import { prisma, serializeProduct } from '@/lib/db'
import { FREE_SHIPPING_OVER, shippingFee } from '@/lib/checkout'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import ProductVisual, { productTypeLabels } from '@/components/product/ProductVisual'

interface CheckoutPageProps {
  params: {
    productId: string
  }
}

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    return product ? serializeProduct(product, { includeFileUrl: false }) : null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const product = await getProduct(params.productId)

  if (!product) {
    notFound()
  }

  const shipping = shippingFee(product.price, product.currency)
  const symbol = product.currency === 'USD' ? '$' : '₹'
  const summary = (product.summary || '').replace(/<[^>]*>/g, '')

  return (
    <div className="bg-cream -mt-px text-charcoal">
      <section className="pt-10 pb-20 md:pb-28">
        <div className="container-custom">
          <nav aria-label="Breadcrumb" className="text-sm text-[#6B5F58] mb-7 truncate">
            <Link href="/" className="hover:text-charcoal">Home</Link> /{' '}
            <Link href="/products" className="hover:text-charcoal">Shop</Link> /{' '}
            <Link href={`/products/${product.slug}`} className="hover:text-charcoal">{product.name}</Link> /{' '}
            <span>Checkout</span>
          </nav>

          <h1 className="font-heading text-4xl md:text-[52px] font-extrabold leading-[1.05] mb-10 md:mb-12">
            Almost <span className="text-terracotta">there</span>
          </h1>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-8 lg:gap-12 items-start">
            {/* Delivery form */}
            <CheckoutForm product={product} />

            {/* Order summary */}
            <aside className="order-first lg:order-last lg:sticky lg:top-28 bg-[#F1EAD9] rounded-[32px] p-6 md:p-8">
              <h2 className="font-heading text-2xl font-extrabold mb-6">Your order</h2>

              <div className="flex gap-4 mb-6">
                <div className="relative w-24 h-24 flex-none rounded-2xl overflow-hidden">
                  <ProductVisual name={product.name} type={product.type} image={product.coverImage} sizes="96px" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold tracking-[0.08em] uppercase text-forest mb-1">
                    {productTypeLabels[product.type] || product.type}
                  </p>
                  <h3 className="font-heading text-xl font-bold leading-tight">{product.name}</h3>
                  {summary && <p className="text-sm text-[#5A4E48] line-clamp-2 mt-1">{summary}</p>}
                </div>
              </div>

              <dl className="space-y-3 border-t border-[#E2D6BF] pt-5 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-[#5A4E48]">Price</dt>
                  <dd className="font-semibold">{symbol}{product.price}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#5A4E48]">Delivery</dt>
                  <dd className="font-semibold">{shipping ? `₹${shipping}` : 'Free'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#5A4E48]">Taxes</dt>
                  <dd className="font-semibold">Included</dd>
                </div>
                <div className="flex justify-between items-baseline border-t border-[#E2D6BF] pt-4">
                  <dt className="font-bold text-lg">Total</dt>
                  <dd className="font-heading text-3xl font-extrabold text-forest">{symbol}{product.price + shipping}</dd>
                </div>
              </dl>
              {shipping > 0 && (
                <p className="mt-3 text-sm text-[#6B5F58]">Free delivery on orders over ₹{FREE_SHIPPING_OVER}.</p>
              )}

              <ul className="grid grid-cols-3 gap-3 mt-7 pt-6 border-t border-[#E2D6BF]">
                <li className="text-center text-[13px] font-semibold text-forest-dark">
                  <CreditCard className="h-5 w-5 mx-auto mb-1.5 text-forest" aria-hidden="true" />
                  Secure via Razorpay
                </li>
                <li className="text-center text-[13px] font-semibold text-forest-dark">
                  <Truck className="h-5 w-5 mx-auto mb-1.5 text-forest" aria-hidden="true" />
                  Delivered across India
                </li>
                <li className="text-center text-[13px] font-semibold text-forest-dark">
                  <Leaf className="h-5 w-5 mx-auto mb-1.5 text-forest" aria-hidden="true" />
                  100% whole grain
                </li>
              </ul>
              <p className="mt-6 text-sm text-[#6B5F58] text-center">
                Pay by UPI, card, netbanking or wallet.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
