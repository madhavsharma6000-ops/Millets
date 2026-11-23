import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

interface BlogCardProps {
  blog: {
    _id: string
    title: string
    slug: string
    excerpt?: string
    category: string
    featuredImage?: string
    imageAlt?: string
    publishedAt?: Date | string | null
    readingTime?: number
  }
  tintIndex?: number
}

const tints = ['bg-[#F6DED2]', 'bg-[#E4ECDF]', 'bg-[#F7E6C8]', 'bg-[#E9EFE3]', 'bg-[#F1EAD9]']

export default function BlogCard({ blog, tintIndex = 0 }: BlogCardProps) {
  const hasImage = Boolean(blog.featuredImage) && !blog.featuredImage!.includes('placeholder')
  const meta = [
    blog.publishedAt ? format(new Date(blog.publishedAt), 'MMM d, yyyy') : null,
    `${blog.readingTime || 5} min read`,
  ].filter(Boolean).join(' · ')

  return (
    <article className="group flex flex-col">
      <Link href={`/blogs/${blog.slug}`} className="relative block h-[220px] rounded-3xl overflow-hidden mb-4" tabIndex={-1} aria-hidden="true">
        {hasImage ? (
          <Image
            src={blog.featuredImage!}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`absolute inset-0 ${tints[tintIndex % tints.length]}`} />
        )}
      </Link>
      <p className="text-xs font-bold tracking-[0.08em] uppercase text-forest mb-2">{blog.category}</p>
      <h3 className="font-heading text-2xl font-bold leading-tight mb-2 text-charcoal">
        <Link href={`/blogs/${blog.slug}`} className="hover:text-terracotta-dark transition-colors">
          {blog.title}
        </Link>
      </h3>
      {blog.excerpt && <p className="text-[15px] text-[#5A4E48] leading-relaxed mb-2.5 line-clamp-3">{blog.excerpt}</p>}
      <p className="text-sm text-[#6B5F58]">{meta}</p>
    </article>
  )
}
