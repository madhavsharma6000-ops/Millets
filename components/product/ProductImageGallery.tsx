'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProductVisual from './ProductVisual'

interface ProductImageGalleryProps {
  coverImage: string
  previewImages?: string[]
  productName: string
  productType: string
  badge?: string
}

export default function ProductImageGallery({
  coverImage,
  previewImages = [],
  productName,
  productType,
  badge,
}: ProductImageGalleryProps) {
  const allImages = [coverImage, ...previewImages].filter((src) => src && !src.includes('placeholder'))
  const [current, setCurrent] = useState(0)
  const [failed, setFailed] = useState(false)

  const showFallback = failed || allImages.length === 0

  return (
    <div>
      <div className="relative h-[360px] md:h-[520px] rounded-[36px] overflow-hidden bg-[#F7E6C8]">
        {showFallback ? (
          <ProductVisual name={productName} type={productType} size="lg" />
        ) : (
          <Image
            src={allImages[current]}
            alt={`${productName} — image ${current + 1} of ${allImages.length}`}
            fill
            priority={current === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        )}
        {badge && (
          <span className="absolute top-5 left-5 z-10 bg-forest-dark text-cream text-xs font-bold tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {!showFallback && allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3.5 mt-3.5">
          {allImages.slice(0, 8).map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={current === i}
              className={`relative h-20 md:h-[100px] rounded-[20px] overflow-hidden transition-colors ${
                current === i ? 'border-[3px] border-terracotta' : 'border-2 border-[#EAE0CC] hover:border-charcoal/40'
              }`}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
