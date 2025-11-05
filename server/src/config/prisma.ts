// prismaClient

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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