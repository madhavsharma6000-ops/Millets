const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const blog = await prisma.blog.findFirst({
    where: { slug: 'nourish-from-within-why-ancient-millets-are-your-gut-s-best-friend' },
    include: { author: true },
  })
  console.log('AUTHOR RECORD:')
  console.log(JSON.stringify(blog.author, null, 2))
  console.log('BLOG AUTHOR ID:', blog.authorId)
  console.log('ALL AUTHORS:')
  const authors = await prisma.author.findMany()
  console.log(JSON.stringify(authors, null, 2))
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
