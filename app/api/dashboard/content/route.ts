/**
 * Content API — Site content CRUD (GET/PUT /api/dashboard/content).
 *
 * GET: Returns the site content of the authenticated user (SiteContent table).
 * PUT: Updates only the fields defined in the CONTENT_FIELDS set from the JSON body.
 *      Unknown fields are filtered out → prevents Prisma errors.
 *      Upsert is used → creates content if it doesn't exist, updates if it does.
 *
 * Both endpoints are protected by requireAuth() (401 Unauthorized).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

// Fields that can be written to SiteContent
const CONTENT_FIELDS = new Set([
    "homeHeroTitle", "homeHeroSubtitle", "aboutMarkdown", "workIntroMarkdown", "contactMarkdown",
    "homeHeroTitleEn", "homeHeroSubtitleEn", "aboutMarkdownEn", "workIntroMarkdownEn", "contactMarkdownEn",
    "musicTitle", "musicTitleEn", "musicContent", "musicContentEn", "musicMediaUrl",
    "canadaTitle", "canadaTitleEn", "canadaContent", "canadaContentEn",
    "womanTitle", "womanTitleEn", "womanContent", "womanContentEn",
    "animalTitle", "animalTitleEn", "animalContent", "animalContentEn",
    "skillsJson", "skillsJsonEn", "timelineJson",
    "typingLinesJson", "typingLinesJsonEn",
    "featuredDescription", "featuredDescriptionEn",
]);

export async function GET() {
    try {
        const { session, error } = await requireAuth();
        if (error) return error;

        const site = await prisma.site.findFirst({
            where: { userId: session!.user.id },
        });
        if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

        const content = await prisma.siteContent.findUnique({
            where: { siteId: site.id },
        });

        return NextResponse.json({ content });
    } catch (err: any) {
        console.error("Content GET error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { session, error } = await requireAuth();
        if (error) return error;

        const site = await prisma.site.findFirst({
            where: { userId: session!.user.id },
        });
        if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

        const body = await req.json();

        // Only pick known content fields to avoid Prisma errors
        const data: Record<string, any> = {};
        for (const [key, value] of Object.entries(body)) {
            if (CONTENT_FIELDS.has(key)) data[key] = value;
        }

        const content = await prisma.siteContent.upsert({
            where: { siteId: site.id },
            create: { siteId: site.id, ...data },
            update: data,
        });

        return NextResponse.json({ content });
    } catch (err: any) {
        console.error("Content PUT error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
