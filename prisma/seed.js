// Seeds an EMPTY database with the admin account, blogs and products.
// Runs on every Vercel build and does nothing once a user exists.
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const data = require('./seed-data.json')

const prisma = new PrismaClient()

// Not a valid bcrypt hash, so nobody can log in until a real password is set
const LOCKED = '!'

async function main() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || ''
  const strong = password.length >= 12 && password !== 'changeme123'
  if (password && !strong) throw new Error('ADMIN_PASSWORD must be at least 12 characters')
  if (!email) throw new Error('Set ADMIN_EMAIL before the first deploy')

  const hash = strong ? await bcrypt.hash(password, 12) : LOCKED

  if ((await prisma.user.count()) === 0) {
    await prisma.$transaction([
      prisma.user.create({ data: { ...data.admin, email, password: hash, role: 'admin' } }),
      prisma.blog.createMany({ data: data.blogs }),
      prisma.product.createMany({ data: data.products }),
    ])
    console.log(`Seed: created admin${strong ? '' : ' (locked: set ADMIN_PASSWORD and redeploy)'}, ${data.blogs.length} blogs, ${data.products.length} products`)
    return
  }

  if (strong) {
    // Only unlocks an account that never had a password; never overwrites one
    const { count } = await prisma.user.updateMany({ where: { email, password: LOCKED }, data: { password: hash } })
    console.log(count ? 'Seed: admin unlocked' : 'Seed: database already has data, skipping')
  } else {
    console.log('Seed: database already has data, skipping')
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
