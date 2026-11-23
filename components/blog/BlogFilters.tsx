'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface BlogFiltersProps {
  categories: { name: string; slug: string; count: number }[]
  currentCategory?: string
}

export default function BlogFilters({ categories, currentCategory }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blogs?search=${encodeURIComponent(searchQuery)}`)
    } else {
      router.push('/blogs')
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <nav aria-label="Filter by topic" className="flex flex-wrap justify-center gap-2.5">
        {categories.map((category) => {
          const active = (!currentCategory && category.slug === 'all') || currentCategory === category.slug
          return (
            <Link
              key={category.slug}
              href={category.slug === 'all' ? '/blogs' : `/blogs?category=${category.slug}`}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center min-h-[44px] px-5 rounded-full border-2 text-sm font-bold transition-colors ${
                active
                  ? 'bg-charcoal border-charcoal text-cream'
                  : 'bg-white border-[#EAE0CC] text-charcoal hover:border-charcoal'
              }`}
            >
              {category.name}
              <span className={`ml-1.5 font-semibold ${active ? 'text-cream/70' : 'text-[#6B5F58]'}`}>{category.count}</span>
            </Link>
          )
        })}
      </nav>

      <form onSubmit={handleSearch} role="search" className="w-full max-w-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/50" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles"
            aria-label="Search articles"
            className="w-full min-h-[44px] pl-10 pr-4 rounded-full border-2 border-[#EAE0CC] bg-white text-sm font-medium text-charcoal focus:border-terracotta focus:outline-none"
          />
        </div>
      </form>
    </div>
  )
}
