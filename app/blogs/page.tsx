import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import BlogCard from '@/components/blog/BlogCard'
import BlogFilters from '@/components/blog/BlogFilters'
import DatabaseError from '@/components/DatabaseError'
import NewsletterForm from '@/components/forms/NewsletterForm'
import { prisma, serializeBlog } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Healthy Tips & Blogs',
  description: 'Millet recipes, nutrition tips and farm stories from the Millet Mountain community.',
  keywords: ['millet recipes', 'millet nutrition', 'ragi', 'ancient grains', 'healthy eating'],
}

// Enable ISR with 60 second revalidation
export const revalidate = 60
export const dynamic = 'force-dynamic'

// Fetch blogs from database
async function getBlogs(searchParams: any) {
  try {
    const query: any = { status: 'published' }

    if (searchParams.category) {
      const categoryMap: { [key: string]: string } = {
        'millet-recipes': 'Millet Recipes',
        'gut-health': 'Gut Health',
        'nutrition-tips': 'Nutrition Tips',
        'ancient-grains': 'Ancient Grains',
        'healthy-snacking': 'Healthy Snacking',
        'wellness-lifestyle': 'Wellness Lifestyle',
        'kids-family': 'Kids & Family',
        'product-stories': 'Product Stories',
      }
      if (categoryMap[searchParams.category]) {
        query.category = categoryMap[searchParams.category]
      }
    }

    if (searchParams.search) {
      query.OR = [
        { title: { contains: searchParams.search, mode: 'insensitive' } },
        { excerpt: { contains: searchParams.search, mode: 'insensitive' } },
        { tags: { contains: searchParams.search, mode: 'insensitive' } },
      ]
    }

    const blogs = await prisma.blog.findMany({
      where: query,
      include: { author: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })

    return blogs.map((rawBlog: any) => {
      const blog = serializeBlog(rawBlog) as any
      const author = blog.author && typeof blog.author === 'object' ? blog.author : null
      return {
        _id: blog._id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || blog.title.substring(0, 150) + '...',
        category: blog.category,
        tags: blog.tags || [],
        featuredImage: blog.featuredImage || '/images/blog-placeholder.jpg',
        imageAlt: blog.imageAlt || blog.title,
        publishedAt: blog.publishedAt || blog.createdAt,
        readingTime: blog.readingTime || 5,
        views: blog.views || 0,
        author: {
          name: author?.name || 'Madhav Sharma',
          avatar: author?.avatar || '',
        },
      }
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const blogs = await getBlogs(searchParams)

  // Count blogs by category
  let categoryCounts: any[] = []
  let totalBlogs = 0
  let hasDbError = false
  
  try {
    const publishedBlogs = await prisma.blog.findMany({
      where: { status: 'published' },
      select: { category: true },
    })
    const counts = publishedBlogs.reduce((acc: Record<string, number>, blog: { category: string }) => {
      acc[blog.category] = (acc[blog.category] || 0) + 1
      return acc
    }, {})
    categoryCounts = Object.entries(counts).map(([category, count]) => ({ category, count }))
    totalBlogs = publishedBlogs.length
  } catch (error) {
    console.error('Error fetching category counts:', error)
    hasDbError = true
  }

  // Show database error page if there's a connection issue
  if (hasDbError) {
    return <DatabaseError />
  }

  const categoryMap: { [key: string]: number } = {}
  categoryCounts.forEach((cat: any) => {
    categoryMap[cat.category] = cat.count
  })

  const categories = [
    { name: 'All', slug: 'all', count: totalBlogs },
    { name: 'Healthy Tips & Blogs', slug: 'millet-recipes', count: categoryMap['Millet Recipes'] || 0 },
    { name: 'Gut Health', slug: 'gut-health', count: categoryMap['Gut Health'] || 0 },
    { name: 'Nutrition Tips', slug: 'nutrition-tips', count: categoryMap['Nutrition Tips'] || 0 },
    { name: 'Ancient Grains', slug: 'ancient-grains', count: categoryMap['Ancient Grains'] || 0 },
    { name: 'Healthy Snacking', slug: 'healthy-snacking', count: categoryMap['Healthy Snacking'] || 0 },
    { name: 'Wellness Lifestyle', slug: 'wellness-lifestyle', count: categoryMap['Wellness Lifestyle'] || 0 },
    { name: 'Kids & Family', slug: 'kids-family', count: categoryMap['Kids & Family'] || 0 },
    { name: 'Product Stories', slug: 'product-stories', count: categoryMap['Product Stories'] || 0 },
  ].filter((c) => c.slug === 'all' || c.count > 0 || c.slug === searchParams.category)

  // Feature the newest post only on the unfiltered first view.
  const isFiltered = Boolean(searchParams.category || searchParams.search)
  const featured = !isFiltered && blogs.length > 0 ? blogs[0] : null
  const rest = featured ? blogs.slice(1) : blogs
  const featuredHasImage = featured && featured.featuredImage && !featured.featuredImage.includes('placeholder')

  return (
    <div className="bg-cream -mt-px text-charcoal">
      {/* Heading + filters */}
      <section className="pt-16 md:pt-20 pb-10">
        <div className="container-custom text-center">
          <p className="text-[13px] font-bold tracking-[0.1em] uppercase text-terracotta-dark mb-3">The Journal</p>
          <h1 className="font-heading text-5xl md:text-[64px] font-extrabold leading-none mb-4 text-balance">
            Healthy Tips &amp; Blogs
          </h1>
          <p className="text-lg text-[#5A4E48] leading-relaxed max-w-xl mx-auto mb-8">
            Everyday ways to cook with millet, and the people who grow it.
          </p>
          <BlogFilters categories={categories} currentCategory={searchParams.category} />
        </div>
      </section>

      {blogs.length === 0 ? (
        <section className="pb-24">
          <div className="container-custom text-center py-12">
            <p className="text-xl text-[#5A4E48] mb-6">No stories found matching your search.</p>
            <Link href="/blogs" className="inline-flex items-center min-h-[48px] px-7 rounded-full bg-terracotta hover:bg-terracotta-dark text-cream font-bold transition-colors">
              View all stories
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <section className="pb-16 md:pb-20">
              <div className="container-custom">
                <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white border-2 border-[#EAE0CC] rounded-[40px] p-4 md:p-6">
                  <Link href={`/blogs/${featured.slug}`} className="relative block h-64 md:h-[400px] rounded-[28px] overflow-hidden bg-[#F6DED2]" tabIndex={-1} aria-hidden="true">
                    {featuredHasImage && (
                      <Image src={featured.featuredImage} alt="" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                    )}
                  </Link>
                  <div className="px-2 pb-4 lg:pr-6 lg:py-4">
                    <p className="inline-block bg-[#E4ECDF] text-forest-dark text-xs font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-4">
                      Featured · {featured.category}
                    </p>
                    <h2 className="font-heading text-3xl md:text-[44px] font-extrabold leading-[1.05] mb-4">
                      <Link href={`/blogs/${featured.slug}`} className="hover:text-terracotta-dark transition-colors">{featured.title}</Link>
                    </h2>
                    <p className="text-[17px] text-[#5A4E48] leading-relaxed mb-6 line-clamp-3">{featured.excerpt}</p>
                    <p className="text-sm text-[#6B5F58]">
                      <strong className="text-charcoal">{featured.author.name}</strong>
                      {featured.publishedAt && <> · {format(new Date(featured.publishedAt), 'MMM d, yyyy')}</>}
                      {' '}· {featured.readingTime} min read
                    </p>
                  </div>
                </article>
              </div>
            </section>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <section className="pb-20 md:pb-24">
              <div className="container-custom grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((blog: any, i: number) => (
                  <BlogCard key={blog._id} blog={blog} tintIndex={i} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter */}
      <section className="pb-20 md:pb-28">
        <div className="container-custom">
          <div className="bg-terracotta text-cream rounded-[40px] p-8 md:p-16 flex flex-wrap gap-8 items-center justify-between">
            <div className="flex-[1_1_380px]">
              <h2 className="font-heading text-3xl md:text-[42px] font-extrabold leading-[1.05] mb-2.5">Never miss a recipe</h2>
              <p className="text-[17px] leading-relaxed text-[#FCEDE5]">
                Seasonal recipes, millet tips and harvest stories in your inbox. No spam.
              </p>
            </div>
            <div className="flex-[1_1_380px]">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
