import Image from 'next/image'

// Category labels and colours shared by the shop, product and home pages.
export const productTypeLabels: Record<string, string> = {
  flours: 'Flours',
  cookies: 'Snacks',
  flakes: 'Breakfast',
  noodles: 'Meal Mixes',
  'gift-packs': 'Gift Packs',
}

const palettes: Record<string, { bg: string; pouch: string }> = {
  flours: { bg: 'bg-[#F7E6C8]', pouch: 'bg-terracotta' },
  cookies: { bg: 'bg-[#E4ECDF]', pouch: 'bg-forest' },
  flakes: { bg: 'bg-[#F6DED2]', pouch: 'bg-ochre' },
  noodles: { bg: 'bg-[#E9EFE3]', pouch: 'bg-sage-dark' },
  'gift-packs': { bg: 'bg-[#F1EAD9]', pouch: 'bg-terracotta-dark' },
}

export function productPalette(type?: string) {
  return palettes[type || ''] || palettes.flours
}

interface ProductVisualProps {
  name: string
  type?: string
  image?: string
  size?: 'sm' | 'md' | 'lg'
  sizes?: string
  priority?: boolean
}

/**
 * Shows the product's cover image, or a drawn pouch in the category colours
 * when no image has been uploaded yet. Fills its (relatively positioned) parent.
 */
export default function ProductVisual({ name, type, image, size = 'md', sizes, priority }: ProductVisualProps) {
  const palette = productPalette(type)
  const hasImage = Boolean(image) && !image!.includes('placeholder')

  if (hasImage) {
    return (
      <Image
        src={image!}
        alt={name}
        fill
        priority={priority}
        sizes={sizes || '(max-width: 768px) 100vw, 33vw'}
        className="object-cover"
      />
    )
  }

  const pouchSize = {
    sm: 'w-10 h-14 rounded-lg p-1',
    md: 'w-24 h-32 rounded-[18px] p-2.5',
    lg: 'w-44 h-60 rounded-[28px] p-4',
  }[size]
  const labelSize = { sm: 'hidden', md: 'text-[10px]', lg: 'text-sm' }[size]
  const tag = (productTypeLabels[type || ''] || name).toUpperCase()

  return (
    <div className={`absolute inset-0 flex items-center justify-center ${palette.bg}`} aria-hidden="true">
      <div className={`${pouchSize} ${palette.pouch} shadow-lg flex items-end`}>
        <div className={`w-full bg-cream rounded-full text-center font-heading font-extrabold text-charcoal py-0.5 truncate ${labelSize}`}>
          {tag}
        </div>
      </div>
    </div>
  )
}
