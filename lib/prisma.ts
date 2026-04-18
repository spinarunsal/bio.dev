/**
 * Prisma Client Singleton — Database connection management.
 *
 * In Next.js development mode, a new PrismaClient is created on every hot-reload.
 * This can exceed the connection limit. We prevent this with the singleton pattern:
 * - A PrismaClient reference is stored on globalThis
 * - Subsequent imports reuse the same instance
 * - This is unnecessary in production but causes no harm
 *
 * Usage:
 *   import { prisma } from "@/lib/prisma";
 *   const users = await prisma.user.findMany();
 *
 * @see https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
