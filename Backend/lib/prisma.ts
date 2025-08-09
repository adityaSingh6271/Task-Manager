import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  // Avoid multiple instances during hot reload in dev
  var __prisma: PrismaClient | undefined;
}

if (!global.__prisma) {
  global.__prisma = new PrismaClient();
}

prisma = global.__prisma;

export default prisma;
