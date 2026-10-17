import 'dotenv/config'
import { PrismaClient } from '@generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcryptjs'

function requiredEnvironmentValue(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(
      'Configure DATABASE_URL, BOOTSTRAP_USER_NAME, BOOTSTRAP_USER_EMAIL e BOOTSTRAP_USER_PASSWORD.',
    )
  }

  return value
}

const name = requiredEnvironmentValue('BOOTSTRAP_USER_NAME').trim()
const email = requiredEnvironmentValue('BOOTSTRAP_USER_EMAIL').trim()
const password = requiredEnvironmentValue('BOOTSTRAP_USER_PASSWORD')
const databaseUrl = requiredEnvironmentValue('DATABASE_URL')

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error('BOOTSTRAP_USER_EMAIL deve conter um e-mail válido.')
}

if (
  password.length < 8 ||
  !/[a-z]/.test(password) ||
  !/[A-Z]/.test(password) ||
  !/\d/.test(password) ||
  !/[^A-Za-z0-9]/.test(password)
) {
  throw new Error('A senha deve ter 8 caracteres e incluir maiúscula, minúscula, número e símbolo.')
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) })

async function main() {
  const activeUsers = await prisma.user.count({ where: { deletedAt: null } })

  if (activeUsers > 0) {
    throw new Error('Já existe uma conta ativa. O bootstrap só pode criar a conta inicial.')
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } })

  if (existingEmail) {
    throw new Error('O e-mail informado já está associado a uma conta.')
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
    },
  })

  console.log('Conta inicial criada. Remova as variáveis BOOTSTRAP_USER_* do ambiente.')
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Falha ao criar conta inicial.')
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
