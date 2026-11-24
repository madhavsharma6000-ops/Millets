import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Wheat, Sprout, Recycle } from 'lucide-react'
import { displayBlogTitle, prisma, serializeProduct, serializeBlog } from '@/lib/db'
import ProductVisual, { productTypeLabels } from '@/components/product/ProductVisual'

export const metadata: Metadata = {
  title: { absolute: 'Millet Mountain | Taste and Health in a Bite' },
  description: 'Nourishment from the peaks. 100% natural millet superfoods — whole grain, high protein, plant-based. Sustainably sourced from hill farmers.',
}

export const revalidate = 60

type ShelfProduct = {
  _id: string
  name: string
  slug: string
  summary: string
  price: number
  currency: string
  type: string
  coverImage?: string
  badge: string
}

const fallbackProducts: ShelfProduct[] = [
  { _id: 'p1', name: 'Himalayan Millet Flour', slug: 'himalayan-millet-flour', summary: 'Stone-ground multi-millet flour, perfect for rotis, pancakes and baking.', price: 299, currency: 'INR', type: 'flours', badge: 'Bestseller' },
  { _id: 'p2', name: 'Sprouted Ragi Cookies', slug: 'sprouted-ragi-cookies', summary: 'Crunchy finger-millet cookies sweetened with jaggery. No refined sugar.', price: 199, currency: 'INR', type: 'cookies', badge: 'New' },
  { _id: 'p3', name: 'Foxtail Millet Flakes', slug: 'foxtail-millet-flakes', summary: 'Ready-in-minutes breakfast flakes. High iron, high fibre, zero fuss.', price: 249, currency: 'INR', type: 'flakes', badge: 'Family Pack' },
  { _id: 'p4', name: 'Little Millet Upma Mix', slug: 'little-millet-upma-mix', summary: 'Traditional upma, lighter and healthier. Just add water and simmer.', price: 229, currency: 'INR', type: 'noodles', badge: 'Quick Cook' },
]

async function getShowcaseProducts(): Promise<ShelfProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'active' },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 4,
    })
    if (!products.length) return fallbackProducts
    return products.map((raw: any) => {
      const p = serializeProduct(raw) as any
      return {
        _id: p._id,
        name: p.name,
        slug: p.slug,
        summary: (p.summary || '').replace(/<[^>]*>/g, ''),
        price: p.price,
        currency: p.currency,
        type: p.type,
        coverImage: p.coverImage,
        badge: productTypeLabels[p.type] || 'Shop Now',
      }
    })
  } catch {
    return fallbackProducts
  }
}

async function getLatestPosts() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: 'published' },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 2,
    })
    return blogs.map((raw: any) => {
      const b = serializeBlog(raw) as any
      return {
        _id: b._id as string,
        title: displayBlogTitle(b.title),
        slug: b.slug as string,
        category: b.category as string,
        featuredImage: b.featuredImage as string,
        readingTime: (b.readingTime || 5) as number,
      }
    })
  } catch {
    return []
  }
}

const postTints = ['bg-[#F6DED2]', 'bg-[#E4ECDF]']

export default async function HomePage() {
  const [products, posts] = await Promise.all([getShowcaseProducts(), getLatestPosts()])

  return (
    <div className="bg-cream -mt-px text-charcoal">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="container-custom pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
            <div className="text-center lg:text-left">
              <h1 className="font-heading text-5xl sm:text-6xl xl:text-[76px] font-extrabold leading-[0.98] mb-9 text-balance">
                Nourishment from the{' '}
                <span className="text-terracotta border-b-[6px] border-ochre">Peaks</span>
              </h1>

              <p className="text-lg md:text-xl text-[#5A4E48] leading-relaxed mb-9">
                Ancient hill grains, milled into honest food.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2.5 min-h-[56px] px-8 bg-terracotta hover:bg-terracotta-dark text-cream rounded-full font-bold text-lg transition-colors"
                >
                  Shop Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative mx-auto w-full max-w-lg h-[420px] md:h-[520px]">
              <div className="absolute inset-0 bg-[#F1EAD9] border-2 border-[#EAE0CC] rounded-[48px] rotate-2" aria-hidden="true" />
              <div className="absolute inset-0 rounded-[48px] overflow-hidden">
                <Image
                  src="/images/hero-fields.webp"
                  alt="Illustration of a golden sun rising over rolling grain fields and forested hills"
                  fill
                  priority
                  sizes="(max-width: 560px) 100vw, 512px"
                  className="object-cover object-[50%_35%]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Shelf ===== */}
      <section className="py-20 md:py-28 bg-[#F1EAD9]">
        <div className="container-custom">
          <div className="flex flex-wrap justify-between items-end gap-6 mb-10 md:mb-12">
            <div>
              <p className="text-[13px] font-bold tracking-[0.1em] uppercase text-terracotta-dark mb-3">From Our Pantry</p>
              <h2 className="font-heading text-4xl md:text-[52px] font-extrabold leading-[1.05]">
                The Millet <span className="text-terracotta">Shelf</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-full border-2 border-charcoal text-charcoal font-bold hover:bg-charcoal hover:text-cream transition-colors"
            >
              View all products
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <article key={product._id} className="group bg-cream border-2 border-[#EAE0CC] rounded-[28px] overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="relative h-[200px]">
                  <ProductVisual name={product.name} type={product.type} image={product.coverImage} sizes="(max-width: 640px) 100vw, 25vw" />
                  <span className="absolute top-3.5 left-3.5 z-10 bg-forest-dark text-cream text-[11px] font-bold tracking-[0.06em] uppercase px-3 py-1 rounded-full">
                    {product.badge}
                  </span>
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h3 className="font-heading text-xl font-bold leading-tight mb-2">
                    <Link href={`/products/${product.slug}`} className="hover:text-terracotta-dark transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-[#5A4E48] leading-relaxed mb-5 line-clamp-2 flex-1">{product.summary}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-2xl font-extrabold text-forest">
                      {product.currency === 'INR' ? '₹' : '$'}{product.price}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center min-h-[44px] px-5 rounded-full bg-terracotta hover:bg-terracotta-dark text-cream text-sm font-bold transition-colors"
                      aria-label={`View ${product.name}`}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Why millets ===== */}
      <section id="features" className="py-20 md:py-28">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <p className="text-[13px] font-bold tracking-[0.1em] uppercase text-terracotta-dark mb-3">Why Millets</p>
            <h2 className="font-heading text-4xl md:text-[52px] font-extrabold leading-[1.05] mb-4 text-balance">
              Good for You, <span className="text-forest">Gentle on Earth</span>
            </h2>
            <p className="text-[#5A4E48] text-base md:text-lg leading-relaxed">
              Tiny grains, mighty benefits. Here is why families across the mountains swear by millet.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7 max-w-6xl mx-auto">
            <div className="bg-white border-2 border-[#EFE7DA] rounded-[32px] p-8 md:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-[22px] bg-[#F7E6C8] flex items-center justify-center">
                <Wheat className="h-8 w-8 text-terracotta-dark" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-2.5">100% Whole Grain</h3>
              <p className="text-[#5A4E48] leading-relaxed">
                Nothing stripped, nothing added. Every grain is stone-ground with its bran and germ intact for full nutrition.
              </p>
            </div>
            <div className="bg-forest text-cream rounded-[32px] p-8 md:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-[22px] bg-cream/15 flex items-center justify-center">
                <Sprout className="h-8 w-8 text-ochre-light" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-2.5">High Plant Protein</h3>
              <p className="text-[#E8EDE4] leading-relaxed">
                More protein per bowl than rice or wheat — keeping you fuller, stronger and energised through the day.
              </p>
            </div>
            <div className="bg-white border-2 border-[#EFE7DA] rounded-[32px] p-8 md:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-[22px] bg-[#E4ECDF] flex items-center justify-center">
                <Recycle className="h-8 w-8 text-forest" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-2.5">Sustainably Sourced</h3>
              <p className="text-[#5A4E48] leading-relaxed">
                Millets need far less water than other grains. We buy directly from hill farmers at fair prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Story ===== */}
      <section id="story" className="py-16 md:py-20 bg-[#F1EAD9]">
        <div className="container-custom text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold leading-[1.05] mb-5 text-balance">
            From quiet hillsides to your kitchen
          </h2>
          <div className="text-lg text-[#5A4E48] leading-relaxed mb-8 text-balance">
            <p>We buy directly from small hill farmers who have grown millet for generations.</p>
            <p>Our patterns honour the same mountains, inspired by the looms of Kullu.</p>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2.5 min-h-[52px] px-7 rounded-full bg-forest hover:bg-forest-dark text-cream font-bold transition-colors"
          >
            Meet the farmers
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ===== Journal teaser ===== */}
      {posts.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-custom">
            <div className="flex flex-wrap justify-between items-end gap-6 mb-10">
              <h2 className="font-heading text-4xl md:text-[44px] font-extrabold leading-[1.05]">From the Journal</h2>
              <Link href="/blogs" className="font-bold text-terracotta-dark hover:text-charcoal">
                Read all articles →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-7">
              {posts.map((post, i) => (
                <article key={post._id} className="group">
                  <Link href={`/blogs/${post.slug}`} className="block relative h-[220px] md:h-[320px] rounded-3xl overflow-hidden mb-4" tabIndex={-1} aria-hidden="true">
                    {post.featuredImage && !post.featuredImage.includes('placeholder') ? (
                      <Image src={post.featuredImage} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className={`absolute inset-0 ${postTints[i % postTints.length]}`} />
                    )}
                  </Link>
                  <p className="text-xs font-bold tracking-[0.08em] uppercase text-forest mb-2">{post.category}</p>
                  <h3 className="font-heading text-2xl font-bold leading-tight mb-2">
                    <Link href={`/blogs/${post.slug}`} className="hover:text-terracotta-dark transition-colors">{post.title}</Link>
                  </h3>
                  <p className="text-[15px] text-[#6B5F58]">{post.readingTime} min read</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
