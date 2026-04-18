/**
 * Project Detail API — Single project update/delete (PUT/DELETE /api/dashboard/projects/[id]).
 *
 * PUT:    Updates a project. Ownership is verified before updating.
 * DELETE: Deletes a project. Ownership check is performed.
 *
 * Security: Both endpoints use requireAuth() + site ownership verification.
 * Access to another user's project is blocked (returns 404).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const site = await prisma.site.findFirst({
        where: { userId: session!.user.id },
    });
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    // Verify project belongs to user's site
    const existing = await prisma.project.findFirst({
        where: { id, siteId: site.id },
    });
    if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const body = await req.json();

    const project = await prisma.project.update({
        where: { id },
        data: body,
    });

    return NextResponse.json({ project });
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const site = await prisma.site.findFirst({
        where: { userId: session!.user.id },
    });
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    const existing = await prisma.project.findFirst({
        where: { id, siteId: site.id },
    });
    if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
