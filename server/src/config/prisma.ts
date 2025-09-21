// prismaClient

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to the database');
  } catch (e) {
    console.error('Failed to connect to the database:', e);
  }
}

main();


export default prisma;