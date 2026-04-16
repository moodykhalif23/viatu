import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { db: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const { Pool } = require('pg') as typeof import('pg');
  const { PrismaPg } = require('@prisma/adapter-pg') as typeof import('@prisma/adapter-pg');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as any);
}

export function getDb(): PrismaClient {
  if (!globalForPrisma.db) {
    globalForPrisma.db = createPrismaClient();
  }
  return globalForPrisma.db;
}

// Convenience re-export for code that imports `db` directly
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
