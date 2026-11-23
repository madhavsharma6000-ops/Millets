import { NextRequest, NextResponse } from 'next/server'
import { del, list, put } from '@vercel/blob'
import { requireAdminAuth } from '@/lib/auth-helper'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Vercel's filesystem is read-only, so production stores files in Vercel Blob.
// Without a token (local dev) files go to public/uploads.
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)

function ensureDir(dir: string) {
  return fs.mkdir(dir, { recursive: true })
}

function sanitizeExt(filename: string) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.pdf']
  const ext = path.extname(filename).toLowerCase()
  return allowed.includes(ext) ? ext : '.jpg'
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const ext = sanitizeExt(file.name || 'image.jpg')
    const publicId = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`
    const filename = `${publicId}${ext}`

    if (useBlob) {
      const blob = await put(`uploads/${filename}`, bytes, {
        access: 'public',
        addRandomSuffix: false,
        contentType: file.type || undefined,
      })
      return NextResponse.json({ url: blob.url, publicId, width: null, height: null }, { status: 200 })
    }

    if (process.env.VERCEL) {
      return NextResponse.json({ message: 'File storage is not configured (connect a Vercel Blob store)' }, { status: 503 })
    }

    await ensureDir(UPLOAD_DIR)
    await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes)

    return NextResponse.json(
      {
        url: `/uploads/${filename}`,
        publicId,
        width: null,
        height: null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdminAuth()
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status })

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { message: 'No public ID provided' },
        { status: 400 }
      )
    }

    if (!/^\d+-[0-9a-f]{16}$/.test(publicId)) {
      return NextResponse.json({ message: 'Invalid public ID' }, { status: 400 })
    }

    if (useBlob) {
      const { blobs } = await list({ prefix: `uploads/${publicId}` })
      if (blobs.length) await del(blobs.map((b) => b.url))
      return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 })
    }

    const file = (await fs.readdir(UPLOAD_DIR)).find((f) => f.startsWith(publicId))
    if (file) {
      await fs.unlink(path.join(UPLOAD_DIR, file))
    }

    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { message: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
