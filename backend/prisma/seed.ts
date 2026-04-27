import { PrismaClient } from '@generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { seedData } from './seed-data'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  for (const [model, records] of Object.entries(seedData)) {
    const delegate = prisma[model]

    for (const record of records) {
      await delegate.upsert({
        where: { id: record.id },
        update: record,
        create: record,
      })
    }

    console.log(`✅ ${records.length} ${model} seeded`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
