// prismaClient
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client";
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DB_URI });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to the database');
  } catch (e) {
    console.error('Failed to connect to the database:', e);
    setTimeout(main, 4000)
  }
}

main();


export default prisma;