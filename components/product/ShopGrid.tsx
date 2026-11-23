'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import ProductCard, { ProductCardData } from './ProductCard'
import { productTypeLabels } from './ProductVisual'

type SortKey = 'featured' | 'price-asc' | 'price-desc'

export default function ShopGrid({ products }: { products: ProductCardData[] }) {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('featured')

  // Only offer categories that actually have products.
  const categories = useMemo(() => {
    const present = Array.from(new Set(products.map((p) => p.type)))
    return [
      { value: 'all', label: 'All' },
      ...Object.keys(productTypeLabels)
        .filter((t) => present.includes(t))
        .map((t) => ({ value: t, label: productTypeLabels[t] })),
    ]
  }, [products])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = products.filter(
      (p) =>
        (category === 'all' || p.type === category) &&
        (!q || p.name.toLowerCase().includes(q) || (p.summary || '').toLowerCase().includes(q))
    )
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [products, category, query, sort])

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2.5">
          {categories.map((c) => {
            const active = category === c.value
            return (
              <button
                key={c.value}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c.value)}
                className={`min-h-[44px] px-5 rounded-full border-2 text-sm font-bold transition-colors ${
                  active
                    ? 'bg-charcoal border-charcoal text-cream'
                    : 'bg-white border-[#EAE0CC] text-charcoal hover:border-charcoal'
                }`}
              >
                {c.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/50" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="min-h-[44px] w-60 rounded-full border-2 border-[#EAE0CC] bg-white pl-10 pr-4 text-sm font-medium text-charcoal focus:border-terracotta focus:outline-none"
            />
          </div>
          <label htmlFor="shop-sort" className="text-sm font-semibold text-[#5A4E48]">Sort</label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="min-h-[44px] rounded-full border-2 border-[#EAE0CC] bg-white px-4 text-sm font-semibold text-charcoal focus:border-terracotta focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-[#6B5F58] mt-5 mb-6" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? 'product' : 'products'}
      </p>

      {shown.length === 0 ? (
        <div className="text-center py-16 rounded-[28px] border-2 border-dashed border-[#EAE0CC]">
          <p className="text-lg text-[#5A4E48] mb-4">No products match your filters.</p>
          <button
            type="button"
            onClick={() => { setCategory('all'); setQuery('') }}
            className="min-h-[44px] px-6 rounded-full border-2 border-charcoal font-bold text-charcoal hover:bg-charcoal hover:text-cream transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
