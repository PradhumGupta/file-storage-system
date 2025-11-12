"use strict";
// prismaClient
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        await prisma.$connect();
        console.log('Connected to the database');
    }
    catch (e) {
        console.error('Failed to connect to the database:', e);
        setTimeout(main, 4000);
    }
}
main();
exports.default = prisma;
