const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const mapping = {
  'AI Tools & Platforms': 'Millet Recipes',
  'AI Prompts & Techniques': 'Gut Health',
  'AI Automation': 'Nutrition Tips',
  'AI Money Making': 'Ancient Grains',
  'AI Agents': 'Healthy Snacking',
  'ChatGPT & LLMs': 'Wellness Lifestyle',
  'AI for Business': 'Kids & Family',
  'AI Guides & Tutorials': 'Product Stories',
}

async function main() {
  let total = 0
  for (const [oldCat, newCat] of Object.entries(mapping)) {
    const res = await prisma.blog.updateMany({
      where: { category: oldCat },
      data: { category: newCat },
    })
    total += res.count
    if (res.count) console.log(`${oldCat} -> ${newCat}: ${res.count} updated`)
  }
  console.log(`Done. ${total} blog(s) migrated.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
