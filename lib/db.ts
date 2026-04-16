import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = globalThis as unknown as { db: ReturnType<typeof makePrismaClient> | undefined };

function makePrismaClient() {
  return new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
  } as any).$extends(withAccelerate());
}

export const db = globalForPrisma.db ?? makePrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db;
