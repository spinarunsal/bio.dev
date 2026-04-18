/**
 * Check Slug API — Slug availability check (GET /api/auth/check-slug?slug=xxx).
 *
 * Used for real-time slug validation on the registration page.
 * Checks:
 * 1. Is the slug format valid? (regex + length)
 * 2. Is it a reserved slug? (admin, dashboard, etc.)
 * 3. Is it already taken by another user in the DB?
 *
 * Returns JSON: { available: true/false, reason?: "invalid"|"reserved" }
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
        return NextResponse.json({ available: false });
    }

    const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!slugRegex.test(slug) || slug.length < 3 || slug.length > 30) {
        return NextResponse.json({ available: false, reason: "invalid" });
    }

    const reserved = [
        "admin", "dashboard", "login", "register", "api", "about",
        "contact", "work", "settings", "blog", "help", "support",
        "pricing", "terms", "privacy", "app", "www", "mail",
    ];
    if (reserved.includes(slug)) {
        return NextResponse.json({ available: false, reason: "reserved" });
    }

    const existing = await prisma.site.findUnique({ where: { slug } });
    return NextResponse.json({ available: !existing });
}
