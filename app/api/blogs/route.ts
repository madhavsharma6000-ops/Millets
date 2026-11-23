import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth-helper'
import { blogDataFromRequest, prisma, serializeBlog } from '@/lib/db'

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

function buildBlogWhere(category: string | null, search: string | null, includeDrafts = false) {
  const where: any = includeDrafts ? {} : { status: 'published' }

  if (category) {
    where.category = categoryMap[category] || category
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { tags: { contains: search, mode: 'insensitive' } },
    ]
  }

  return where
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const where = buildBlogWhere(category, search)

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: { author: { select: { id: true, name: true, avatar: true, email: true, createdAt: true, updatedAt: true } } },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ])

    return NextResponse.json(
      {
        blogs: blogs.map(serializeBlog),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Blogs API error:', error)
    return NextResponse.json({ message: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) {
      return NextResponse.json({ message: auth.message }, { status: auth.status })
    }

    const body = await request.json()
    let authorId = body.author || body.authorId

    if (!authorId || !(await prisma.user.findUnique({ where: { id: authorId } }))) {
      authorId = auth.user?.id
    }

    let slug = body.slug
    let counter = 1
    while (await prisma.blog.findUnique({ where: { slug } })) {
      slug = `${body.slug}-${counter}`
      counter++
    }

    const blog = await prisma.blog.create({
      data: { ...blogDataFromRequest({ ...body, slug }), authorId },
      include: { author: true },
    })

    return NextResponse.json(
      { message: 'Blog created successfully', blog: serializeBlog(blog) },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create blog error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create blog' },
      { status: 500 }
    )
  }
}
