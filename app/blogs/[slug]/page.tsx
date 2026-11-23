import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Eye, ArrowLeft, ArrowRight, ExternalLink, Leaf } from 'lucide-react'
import { format } from 'date-fns'
import BlogCard from '@/components/blog/BlogCard'
import AuthorImage from '@/components/blog/AuthorImage'
import DatabaseError from '@/components/DatabaseError'
import { prisma, serializeBlog } from '@/lib/db'

// Enable ISR with 60 second revalidation
export const revalidate = 60

// Fetch blog from database
async function getBlogBySlug(slug: string) {
  try {
    const blogData = await prisma.blog.findFirst({
      where: { slug, status: 'published' },
      include: { author: true },
    })

    if (!blogData) {
      return null
    }

    const blog: any = serializeBlog(blogData)
    const authorData = blog.author && typeof blog.author === 'object' ? blog.author : null

    return {
      _id: blog._id,
      title: blog.title,
      slug: blog.slug,
      metaTitle: blog.metaTitle || blog.title,
      metaDescription: blog.metaDescription || blog.excerpt,
      keywords: blog.keywords || [],
      ogImage: blog.ogImage || blog.featuredImage,
      excerpt: blog.excerpt,
      content: blog.content,
      featuredImage: blog.featuredImage,
      imageAlt: blog.imageAlt || blog.title,
      category: blog.category,
      tags: blog.tags || [],
      publishedAt: blog.publishedAt || blog.createdAt,
      readingTime: blog.readingTime || 5,
      views: blog.views || 0,
      author: {
        _id: authorData?._id || 'default',
        name: authorData?.name || 'Madhav Sharma',
        email: authorData?.email,
        avatar: authorData?.avatar || '/images/author-madhav.jpg',
        bio:
          authorData?.bio ||
          'A passionate advocate for whole foods and sustainable farming, our team at Millet Mountain believes that the smallest grains can make the biggest difference. From hill farms to your table, every story we share is rooted in nutrition, tradition, and care for the land.',
      },
      sections: blog.sections || [],
      internalLinks: blog.internalLinks || [],
      externalReferences: blog.externalReferences || [],
    }
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

async function getRelatedBlogs(currentBlogId: string, category: string) {
  try {
    const relatedBlogs = await prisma.blog.findMany({
      where: { id: { not: currentBlogId }, status: 'published' },
      include: { author: true },
      orderBy: [
        { category: 'asc' },
        { publishedAt: 'desc' },
      ],
      take: 3,
    })

    return relatedBlogs.map((rawBlog: any) => {
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
        publishedAt: blog.publishedAt || blog.createdAt,
        readingTime: blog.readingTime || 5,
        views: blog.views || 0,
        author: {
          name: author?.name || 'Madhav Sharma',
          avatar: author?.avatar || '',
          bio: author?.bio || 'Millet Mountain | Health & Nutrition',
        },
      }
    })
  } catch (error) {
    console.error('Error fetching related blogs:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.keywords,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      type: 'article',
      publishedTime: new Date(blog.publishedAt).toISOString(),
      authors: [blog.author.name],
      tags: blog.tags,
      images: [
        {
          url: blog.ogImage || blog.featuredImage,
          width: 1200,
          height: 630,
          alt: blog.imageAlt || blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: [blog.ogImage || blog.featuredImage],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    // Check if it's a database error or just not found
    try {
      await prisma.$queryRaw`SELECT 1`
      notFound()
    } catch (error) {
      // If the database health check fails, show database error page
      return <DatabaseError />
    }
  }

  const relatedBlogs = await getRelatedBlogs(blog._id, blog.category)

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage,
    datePublished: new Date(blog.publishedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: blog.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Millet Mountain',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://milletmountain.com/blogs/${blog.slug}`,
    },
    keywords: blog.keywords.join(', '),
    articleSection: blog.category,
    wordCount: blog.content.split(' ').length,
  }

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <section className="bg-cream py-4 border-b border-[#EAE0CC]">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 text-sm text-charcoal/60">
            <Link href="/" className="hover:text-terracotta transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-terracotta transition-colors">Healthy Tips &amp; Blogs</Link>
            <span>/</span>
            <span className="text-charcoal font-semibold">{blog.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <article className="bg-paper-texture">
        <div className="container-custom max-w-4xl py-12 sm:py-16">
          {/* Back Button */}
          <Link
            href="/blogs"
            className="inline-flex items-center text-terracotta hover:text-terracotta-dark mb-8 font-heading font-bold group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Healthy Tips &amp; Blogs
          </Link>

          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 bg-sage/20 border border-sage/40 rounded-full px-4 py-1.5 mb-5">
            <Leaf className="h-3.5 w-3.5 text-forest" />
            <span className="text-xs font-bold text-forest tracking-wide uppercase">{blog.category}</span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-charcoal leading-tight mb-8">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="bg-white/80 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-5 sm:p-6 mb-10 shadow-sm">
            <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-charcoal/70">
              <div className="flex items-center gap-3">
                <AuthorImage src={blog.author.avatar} alt={blog.author.name} size="small" />
                <div>
                  <p className="font-heading font-extrabold text-charcoal">{blog.author.name}</p>
                  <p className="text-sm text-charcoal/50">Millet Mountain | Health &amp; Nutrition</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-full bg-terracotta/15 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-terracotta" />
                </div>
                <span className="text-sm font-semibold">{format(new Date(blog.publishedAt), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-full bg-sage/25 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-forest" />
                </div>
                <span className="text-sm font-semibold">{blog.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-8 w-8 rounded-full bg-ochre/20 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-ochre-dark" />
                </div>
                <span className="text-sm font-semibold">{blog.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="aspect-video rounded-[2rem] mb-12 relative overflow-hidden border-4 border-white shadow-xl">
              <img
                src={blog.featuredImage}
                alt={blog.imageAlt || blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-extrabold prose-headings:text-charcoal prose-p:text-charcoal/75 prose-p:leading-relaxed prose-li:text-charcoal/75 prose-strong:text-charcoal prose-a:text-terracotta prose-a:no-underline hover:prose-a:underline prose-a:font-semibold prose-blockquote:border-l-terracotta prose-blockquote:bg-sage/10 prose-blockquote:rounded-r-2xl prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:not-italic prose-h2:text-2xl prose-h2:mt-10 prose-h3:text-xl"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t-2 border-[#EAE0CC]">
            <h3 className="font-heading text-sm font-extrabold text-charcoal/60 uppercase tracking-widest mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string) => (
                <Link
                  href={`/blogs?search=${tag}`}
                  className="px-4 py-2 bg-cream border border-[#EFE7DA] text-forest rounded-full hover:bg-terracotta hover:border-terracotta hover:text-cream transition-all duration-300 font-semibold text-sm"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Internal Links */}
          {blog.internalLinks.length > 0 && (
            <div className="mt-8 p-6 sm:p-8 bg-sage/15 border-2 border-sage/40 rounded-3xl">
              <h3 className="font-heading text-xl font-extrabold text-forest mb-4">Keep Exploring</h3>
              <ul className="space-y-2">
                {blog.internalLinks.map((link: any) => (
                  <li key={link.url}>
                    <Link
                      href={link.url}
                      className="text-terracotta hover:text-terracotta-dark font-semibold hover:underline"
                    >
                      → {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* External References */}
          {blog.externalReferences.length > 0 && (
            <div className="mt-8 p-6 sm:p-8 bg-white/80 border-2 border-[#EAE0CC] rounded-3xl">
              <h3 className="font-heading text-xl font-extrabold text-charcoal mb-4">References &amp; Sources</h3>
              <ul className="space-y-3">
                {blog.externalReferences.map((ref: any, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-ochre/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ExternalLink className="h-3.5 w-3.5 text-ochre-dark" />
                    </div>
                    <div>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-terracotta hover:text-terracotta-dark font-semibold hover:underline"
                      >
                        {ref.title}
                      </a>
                      <p className="text-sm text-charcoal/50">{ref.source}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-12 p-6 sm:p-10 bg-white/90 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <AuthorImage src={blog.author.avatar} alt={blog.author.name} size="large" />
              <div>
                <div className="inline-flex items-center gap-2 bg-ochre/20 rounded-full px-3 py-1 mb-3">
                  <Leaf className="h-3.5 w-3.5 text-ochre-dark" />
                  <span className="text-xs font-bold text-ochre-dark uppercase tracking-wide">The Storyteller</span>
                </div>
                <h3 className="font-heading text-xl font-extrabold text-charcoal mb-3">
                  About {blog.author.name}
                </h3>
                <div className="text-charcoal/70 mb-5 leading-relaxed whitespace-pre-line">
                  {blog.author.bio}
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-terracotta hover:text-terracotta-dark font-heading font-bold"
                >
                  View Full Profile <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Suggested Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="section-padding bg-paper-texture border-t border-[#EAE0CC]">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-sage/20 border border-sage/40 rounded-full px-4 py-1.5 mb-4">
                <Leaf className="h-4 w-4 text-forest" />
                <span className="text-xs font-bold tracking-widest uppercase text-forest">More From the Hills</span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal">
                Suggested <span className="text-terracotta">Reading</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard key={relatedBlog._id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-forest-dark text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sage rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ochre rounded-full blur-3xl"></div>
        </div>
        <div className="container-custom text-center max-w-3xl mx-auto relative z-10 py-16 sm:py-20">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">
            Ready to <span className="text-ochre">Taste the Peaks?</span>
          </h2>
          <p className="text-lg sm:text-xl text-cream/80 mb-8">
            100% natural millet goodness — nourishment from the mountains, delivered to your door.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-cream font-heading font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Shop Our Millets
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  )
}