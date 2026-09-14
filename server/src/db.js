const { PrismaClient } = require("@prisma/client");

// Reuse a single PrismaClient instance across the process (and across
// nodemon reloads in dev) instead of opening a new pool per import.
const globalForPrisma = globalThis;

const prisma = globalForPrisma.__umbraPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__umbraPrisma = prisma;
}

module.exports = { prisma };
