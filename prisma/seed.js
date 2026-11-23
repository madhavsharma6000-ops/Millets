// Seeds an EMPTY database with the admin account, blogs and products.
// Runs on every Vercel build and does nothing once a user exists.
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const data = require('./seed-data.json')

const prisma = new PrismaClient()

async function main() {
  if ((await prisma.user.count()) > 0) {
    console.log('Seed: database already has data, skipping')
    return
  }

  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || ''
  if (!email || password.length < 12 || password === 'changeme123') {
    throw new Error('Set ADMIN_EMAIL and a strong ADMIN_PASSWORD (12+ characters) before the first deploy')
  }

  await prisma.$transaction([
    prisma.user.create({ data: { ...data.admin, email, password: await bcrypt.hash(password, 12), role: 'admin' } }),
    prisma.blog.createMany({ data: data.blogs }),
    prisma.product.createMany({ data: data.products }),
  ])
  console.log(`Seed: created admin, ${data.blogs.length} blogs, ${data.products.length} products`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
