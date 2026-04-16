import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { db: PrismaClient | undefined };

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as any);
}

export const db: PrismaClient = globalForPrisma.db ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.db = db;
