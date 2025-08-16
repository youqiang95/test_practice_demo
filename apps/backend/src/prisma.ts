import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Checks database connection by executing a simple query
 * @throws {Error} If database connection fails
 */
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export default prisma;
