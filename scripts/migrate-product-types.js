const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const mapping = {
  'ai-prompts': 'flours',
  'ai-guides': 'cookies',
  'ai-agents': 'flakes',
  'ai-automation': 'noodles',
  'ai-templates': 'gift-packs',
}

async function main() {
  let total = 0
  for (const [oldType, newType] of Object.entries(mapping)) {
    const res = await prisma.product.updateMany({
      where: { type: oldType },
      data: { type: newType },
    })
    total += res.count
    if (res.count) console.log(`${oldType} -> ${newType}: ${res.count} updated`)
  }
  console.log(`Done. ${total} product(s) migrated.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
