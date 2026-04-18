/**
 * Projects API — Project listing and creation (GET/POST /api/dashboard/projects).
 *
 * GET: Returns all of the user's projects ordered by date.
 * POST: Creates a new project. Slug uniqueness is checked per site.
 *
 * Single project update/delete → /api/dashboard/projects/[id]/route.ts
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET() {
    const { session, error } = await requireAuth();
    if (error) return error;

    const site = await prisma.site.findFirst({
        where: { userId: session!.user.id },
    });
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    const projects = await prisma.project.findMany({
        where: { siteId: site.id },
        orderBy: { date: "desc" },
    });

    return NextResponse.json({ projects });
}

export async function POST(req: Request) {
    const { session, error } = await requireAuth();
    if (error) return error;

    const site = await prisma.site.findFirst({
        where: { userId: session!.user.id },
    });
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    const body = await req.json();
    const { slug, ...rest } = body;

    if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Check slug uniqueness within site
    const existing = await prisma.project.findFirst({
        where: { siteId: site.id, slug },
    });
    if (existing) {
        return NextResponse.json({ error: "This slug is already in use" }, { status: 409 });
    }

    const project = await prisma.project.create({
        data: {
            siteId: site.id,
            slug,
            ...rest,
        },
    });

    return NextResponse.json({ project }, { status: 201 });
}
