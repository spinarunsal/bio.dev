/**
 * Auth Helpers — Server-side authentication utilities.
 *
 * Three helper functions used in API routes and Server Components:
 *
 * 1. getAuthSession() → Reads the current session (returns null or session)
 * 2. getAuthSite()    → Fetches the authenticated user's site from the DB
 * 3. requireAuth()    → Returns 401 error if no session exists (for API routes)
 *
 * These functions are called at the start of every API route:
 *   const { session, error } = await requireAuth();
 *   if (error) return error; // 401 Unauthorized
 */
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Get the current authenticated user's session with site info.
 * Returns null if not authenticated.
 */
export async function getAuthSession() {
    const session = await auth();
    if (!session?.user?.id) return null;
    return session;
}

/**
 * Get the current user's site from the database.
 * Useful for API routes that need full site data.
 */
export async function getAuthSite() {
    const session = await getAuthSession();
    if (!session) return null;

    const site = await prisma.site.findFirst({
        where: { userId: session.user.id },
        include: { content: true, settings: true },
    });

    return site;
}

/**
 * Helper for API routes: returns 401 if not authenticated.
 */
export async function requireAuth() {
    const session = await getAuthSession();
    if (!session) {
        return {
            session: null,
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }
    return { session, error: null };
}
