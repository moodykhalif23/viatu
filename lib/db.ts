import { PrismaClient as PC } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PC | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PC({
    datasourceUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export type PrismaClient = typeof db
