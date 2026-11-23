import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check, CreditCard, Leaf, ShieldCheck, Truck } from 'lucide-react'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import ProductVisual, { productTypeLabels } from '@/components/product/ProductVisual'
import { prisma, serializeProduct } from '@/lib/db'

// Enable ISR with 60 second revalidation
export const revalidate = 60

async function getProductBySlug(slug: string) {
  try {
    const rawProduct = await prisma.product.findFirst({ where: { slug, status: 'active' } })
    if (!rawProduct) return null
    return serializeProduct(rawProduct) as any
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getRelatedProducts(id: string, type: string) {
  try {
    const raw = await prisma.product.findMany({
      where: { status: 'active', NOT: { id } },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 12,
    })
    const list = raw.map((r: any) => serializeProduct(r) as any)
    // Same category first, then the newest of the rest.
    list.sort((a: any, b: any) => Number(b.type === type) - Number(a.type === type))
    return list.slice(0, 3)
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found' }

  const description = product.metaDescription || (product.summary || '').replace(/<[^>]*>/g, '')
  return {
    title: product.metaTitle || product.name,
    description,
    openGraph: {
      title: product.metaTitle || product.name,
      description,
      type: 'website',
      siteName: 'Millet Mountain',
      images: product.coverImage ? [product.coverImage] : ['/logo.png'],
    },
  }
}

const currencySymbol = (currency: string) => (currency === 'INR' ? '₹' : '$')

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product._id, product.type)
  const category = productTypeLabels[product.type] || product.type
  const summary = (product.summary || '').replace(/<[^>]*>/g, '')
  const symbol = currencySymbol(product.currency)
  // Checkout charges the base price, so that is the only price shown here.
  const salePrice = product.price
  const highlights: string[] = [...(product.valuePropositions || []), ...(product.features || [])]
  const testimonials: any[] = product.testimonials || []

  return (
    <div className="bg-cream -mt-px text-charcoal">
      <section className="pt-10 pb-20 md:pb-24">
        <div className="container-custom">
          <nav aria-label="Breadcrumb" className="text-sm text-[#6B5F58] mb-7 truncate">
            <Link href="/" className="hover:text-charcoal">Home</Link> /{' '}
            <Link href="/products" className="hover:text-charcoal">Shop</Link> /{' '}
            <span>{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Gallery */}
            <div className="lg:sticky lg:top-28">
              <ProductImageGallery
                coverImage={product.coverImage}
                previewImages={product.previewImages}
                productName={product.name}
                productType={product.type}
              />
            </div>

            {/* Buy box */}
            <div>
              <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-forest mb-2.5">{category}</p>
              <h1 className="font-heading text-4xl md:text-[56px] font-extrabold leading-none mb-4">{product.name}</h1>
              {summary && <p className="text-lg text-[#5A4E48] leading-relaxed mb-7">{summary}</p>}

              <p className="font-heading text-[44px] font-extrabold text-forest leading-none mb-1">
                {symbol}{salePrice}
              </p>
              <p className="text-sm text-[#6B5F58] mb-8">Inclusive of all taxes · Free shipping over ₹499</p>

              <Link
                href={`/checkout/${product._id}`}
                className="flex w-full items-center justify-center min-h-[56px] rounded-full bg-terracotta hover:bg-terracotta-dark text-cream font-bold text-[17px] transition-colors"
              >
                Buy now — {symbol}{salePrice}
              </Link>
              <p className="mt-3 flex items-center justify-center gap-2 text-sm text-[#6B5F58]">
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Secure payment via Razorpay
              </p>

              <div className="grid grid-cols-3 gap-3 p-5 rounded-3xl bg-[#F1EAD9] my-8">
                <div className="text-center text-[13px] font-semibold text-forest-dark">
                  <Leaf className="h-5 w-5 mx-auto mb-1.5 text-forest" aria-hidden="true" />
                  100% whole grain
                </div>
                <div className="text-center text-[13px] font-semibold text-forest-dark">
                  <ShieldCheck className="h-5 w-5 mx-auto mb-1.5 text-forest" aria-hidden="true" />
                  No preservatives
                </div>
                <div className="text-center text-[13px] font-semibold text-forest-dark">
                  <Truck className="h-5 w-5 mx-auto mb-1.5 text-forest" aria-hidden="true" />
                  Farmer sourced
                </div>
              </div>

              {highlights.length > 0 && (
                <details open className="group border-t border-[#EAE0CC] py-5">
                  <summary className="font-bold text-[17px] cursor-pointer list-none flex justify-between items-center">
                    Why you&apos;ll love it
                    <span className="text-xl text-[#6B5F58] group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                  </summary>
                  <ul className="mt-4 space-y-3">
                    {highlights.map((item, i) => (
                      <li key={i} className="flex gap-3 text-[15px] text-[#5A4E48] leading-relaxed">
                        <span className="mt-0.5 flex-none w-6 h-6 rounded-full bg-[#E4ECDF] flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {product.description && (
                <details className="group border-t border-b border-[#EAE0CC] py-5">
                  <summary className="font-bold text-[17px] cursor-pointer list-none flex justify-between items-center">
                    Details, ingredients &amp; usage
                    <span className="text-xl text-[#6B5F58] group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                  </summary>
                  <div
                    className="mt-4 text-[15px] leading-relaxed text-[#5A4E48] [&_p]:mb-3 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-charcoal [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-charcoal [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_a]:text-terracotta-dark [&_a]:underline [&_strong]:text-charcoal [&_img]:rounded-2xl [&_img]:my-4"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </details>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Customer reviews — only real ones stored on the product */}
      {testimonials.length > 0 && (
        <section className="pb-20 md:pb-24">
          <div className="container-custom">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-8">What customers say</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t: any, i: number) => (
                <figure key={i} className="bg-white border-2 border-[#EAE0CC] rounded-[28px] p-7">
                  <blockquote className="text-[#5A4E48] leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</blockquote>
                  <figcaption className="border-t border-[#EFE7DA] pt-4">
                    <p className="font-bold text-charcoal">{t.author}</p>
                    {(t.role || t.location) && (
                      <p className="text-sm text-[#6B5F58]">{[t.role, t.location].filter(Boolean).join(' · ')}</p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 bg-[#F1EAD9]">
          <div className="container-custom">
            <h2 className="font-heading text-3xl md:text-[40px] font-extrabold mb-8">Pairs well with</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r: any) => (
                <Link
                  key={r._id}
                  href={`/products/${r.slug}`}
                  className="flex gap-4 items-center bg-cream border-2 border-[#EAE0CC] rounded-3xl p-4 hover:border-charcoal/40 transition-colors"
                >
                  <div className="relative w-[88px] h-[88px] flex-none rounded-[18px] overflow-hidden">
                    <ProductVisual name={r.name} type={r.type} image={r.coverImage} size="sm" sizes="88px" />
                  </div>
                  <div>
                    <p className="font-heading text-[19px] font-bold leading-tight">{r.name}</p>
                    <p className="font-bold text-forest mt-1">{currencySymbol(r.currency)}{r.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
