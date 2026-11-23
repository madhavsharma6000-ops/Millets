import Link from 'next/link'
import ProductVisual, { productTypeLabels } from './ProductVisual'

export interface ProductCardData {
  _id: string
  name: string
  slug: string
  summary?: string
  type: string
  price: number
  currency: string
  coverImage?: string
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const summary = (product.summary || '').replace(/<[^>]*>/g, '')
  const category = productTypeLabels[product.type] || product.type

  return (
    <article className="group bg-white border-2 border-[#EAE0CC] rounded-[28px] overflow-hidden h-full flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <Link href={`/products/${product.slug}`} className="relative block h-60" tabIndex={-1} aria-hidden="true">
        <ProductVisual name={product.name} type={product.type} image={product.coverImage} />
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-forest mb-1.5">{category}</p>
        <h3 className="font-heading text-[23px] font-bold leading-tight mb-2 text-charcoal">
          <Link href={`/products/${product.slug}`} className="hover:text-terracotta-dark transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-[15px] text-[#5A4E48] leading-relaxed mb-5 line-clamp-2 flex-1">{summary}</p>

        <div className="flex items-center justify-between gap-3">
          <span className="font-heading text-[26px] font-extrabold text-forest">
            {product.currency === 'INR' ? '₹' : '$'}{product.price}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center min-h-[44px] px-5 rounded-full bg-terracotta hover:bg-terracotta-dark text-cream text-sm font-bold transition-colors"
            aria-label={`View ${product.name}`}
          >
            View product
          </Link>
        </div>
      </div>
    </article>
  )
}
