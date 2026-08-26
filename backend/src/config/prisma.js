import { PrismaClient } from '@prisma/client';

/**
 * Checks whether PostgreSQL database URL is configured.
 * @returns {boolean}
 */
export const isDatabaseConfigured = () => {
  return Boolean(process.env.DATABASE_URL);
};

/**
 * Global singleton instance of PrismaClient
 * Reused across all services to prevent connection pool exhaustion.
 */
let prismaInstance;

export const getPrismaClient = () => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  return prismaInstance;
};

export const prisma = getPrismaClient();
