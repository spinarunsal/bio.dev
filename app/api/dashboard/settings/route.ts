/**
 * Settings API — Site settings CRUD (GET/PUT /api/dashboard/settings).
 *
 * GET: Returns site info (slug, title, isPublished) + SiteSettings (social links, metrics).
 * PUT: Updates both site data and settings.
 *      - siteData: Site table (title, slug, langDefault, isPublished)
 *      - settingsData: SiteSettings table (email, linkedin, github, etc.)
 *      - Uniqueness check is performed on slug changes
 *      - Only fields in the SITE_FIELDS and SETTINGS_FIELDS sets are updated
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

const SETTINGS_FIELDS = new Set([
    "email", "linkedin", "github", "website", "cvUrl",
    "yearsExperience", "projectsDelivered", "industriesServed", "availabilityStatus",
    "socialLink1Title", "socialLink1Url", "socialLink2Title", "socialLink2Url",
]);

const SITE_FIELDS = new Set(["title", "slug", "langDefault", "theme", "isPublished"]);

export async function GET() {
    try {
        const { session, error } = await requireAuth();
        if (error) return error;

        const site = await prisma.site.findFirst({
            where: { userId: session!.user.id },
            include: { settings: true },
        });
        if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

        return NextResponse.json({
            site: {
                id: site.id,
                slug: site.slug,
                title: site.title,
                langDefault: site.langDefault,
                theme: site.theme,
                isPublished: site.isPublished,
            },
            settings: site.settings,
        });
    } catch (err: any) {
        console.error("Settings GET error:", err);
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
        const { siteData, settingsData } = body;

        // Update site (only known fields)
        if (siteData) {
            const cleanSite: Record<string, any> = {};
            for (const [k, v] of Object.entries(siteData)) {
                if (SITE_FIELDS.has(k)) cleanSite[k] = v;
            }

            if (cleanSite.slug && cleanSite.slug !== site.slug) {
                const existing = await prisma.site.findUnique({
                    where: { slug: cleanSite.slug as string },
                });
                if (existing) {
                    return NextResponse.json({ error: "This slug is already in use" }, { status: 409 });
                }
            }

            await prisma.site.update({
                where: { id: site.id },
                data: cleanSite,
            });
        }

        // Update settings (only known fields)
        if (settingsData) {
            const cleanSettings: Record<string, any> = {};
            for (const [k, v] of Object.entries(settingsData)) {
                if (SETTINGS_FIELDS.has(k)) cleanSettings[k] = v;
            }

            await prisma.siteSettings.upsert({
                where: { siteId: site.id },
                create: { siteId: site.id, ...cleanSettings },
                update: cleanSettings,
            });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Settings PUT error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
