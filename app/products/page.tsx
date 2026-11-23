import { Metadata } from 'next'
import Link from 'next/link'
import { Award, Leaf, Truck } from 'lucide-react'
import ShopGrid from '@/components/product/ShopGrid'
import { prisma, serializeProduct } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Shop 100% natural millet superfoods — whole grain flours, cookies, flakes and quick-cook mixes. Taste and health in a bite.',
}

// Enable ISR with 60 second revalidation
export const revalidate = 60

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'active' },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 100,
    })

    return products.map((rawProduct: any) => {
      const product = serializeProduct(rawProduct) as any
      return {
        _id: product._id as string,
        name: product.name as string,
        slug: product.slug as string,
        summary: (product.summary || '') as string,
        type: product.type as string,
        price: product.price as number,
        currency: product.currency as string,
        coverImage: product.coverImage as string,
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="bg-cream -mt-px text-charcoal">
      {/* Page heading */}
      <section className="bg-[#F1EAD9] pt-14 pb-12 md:pt-16 md:pb-14">
        <div className="container-custom">
          <nav aria-label="Breadcrumb" className="text-sm text-[#6B5F58] mb-3.5">
            <Link href="/" className="hover:text-charcoal">Home</Link> / <span>Shop</span>
          </nav>
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold leading-none mb-3">The Millet Shelf</h1>
          <p className="text-lg text-[#5A4E48] leading-relaxed max-w-xl">
            Small-batch staples, milled fresh and packed with care. From our hills to your kitchen.
          </p>
        </div>
      </section>

      {/* Toolbar + grid */}
      <section className="pt-8 pb-20 md:pb-24">
        <div className="container-custom">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-[#5A4E48]">New batches are on their way. Check back soon.</p>
            </div>
          ) : (
            <ShopGrid products={products} />
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 md:py-20 bg-[#F1EAD9]">
        <div className="container-custom">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-center mb-10">
            Why Choose <span className="text-forest">Millet Mountain</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-cream border-2 border-[#EAE0CC] rounded-[28px] p-8 text-center">
              <div className="h-14 w-14 rounded-[20px] bg-[#F7E6C8] flex items-center justify-center mx-auto mb-4">
                <Award className="h-7 w-7 text-terracotta-dark" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Proven &amp; Tested</h3>
              <p className="text-[#5A4E48]">Every batch is lab-tested for purity and nutrition.</p>
            </div>
            <div className="bg-cream border-2 border-[#EAE0CC] rounded-[28px] p-8 text-center">
              <div className="h-14 w-14 rounded-[20px] bg-[#E4ECDF] flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-7 w-7 text-forest" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Simple &amp; Honest</h3>
              <p className="text-[#5A4E48]">Short ingredient lists, clear labels, no hidden additives.</p>
            </div>
            <div className="bg-cream border-2 border-[#EAE0CC] rounded-[28px] p-8 text-center">
              <div className="h-14 w-14 rounded-[20px] bg-[#F6DED2] flex items-center justify-center mx-auto mb-4">
                <Truck className="h-7 w-7 text-terracotta-dark" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Fresh &amp; Fast</h3>
              <p className="text-[#5A4E48]">Milled in small batches and shipped quickly, at peak freshness.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
