/**
 * Public Portfolio Page (SSR) — /[slug] route.
 *
 * The user's publicly accessible portfolio page.
 * Site data is fetched from the database based on the slug in the URL:
 * 1. Check if the slug is reserved (login, register, dashboard, etc.)
 * 2. Query site + content + settings + projects from the DB
 * 3. If the site is not published or doesn't exist → 404
 * 4. Data is passed to the PublicPortfolio client component
 *
 * generateMetadata: Produces dynamic title/description for SEO.
 * force-dynamic: Fetches fresh data from the DB on every request (no cache).
 */
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicPortfolio from "./PublicPortfolio";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

// Reserved paths that shouldn't be treated as slug routes
const RESERVED = [
    "login", "register", "dashboard", "api", "admin", "_next",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    if (RESERVED.includes(slug)) return {};

    const site = await prisma.site.findUnique({
        where: { slug },
        include: { content: true, settings: true },
    });

    if (!site || !site.isPublished) return {};

    const title = site.content?.homeHeroTitle || site.title || slug;
    const description = site.content?.homeHeroSubtitle || "";

    return {
        title: `${title} | bio.dev`,
        description,
        openGraph: {
            title: `${title} | bio.dev`,
            description,
            type: "website",
            url: `https://bio.dev/${slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | bio.dev`,
            description,
        },
    };
}

export default async function PublicSitePage({ params }: Props) {
    const { slug } = await params;

    if (RESERVED.includes(slug)) notFound();

    const site = await prisma.site.findUnique({
        where: { slug },
        include: {
            content: true,
            settings: true,
        },
    });

    if (!site || !site.isPublished) notFound();

    const featured = await prisma.project.findMany({
        where: { siteId: site.id, isPublished: true, isFeatured: true },
        orderBy: { date: "desc" },
        take: 4,
    });

    const allProjects = await prisma.project.findMany({
        where: { siteId: site.id, isPublished: true },
        orderBy: { date: "desc" },
    });

    return (
        <PublicPortfolio
            site={site}
            content={site.content}
            settings={site.settings}
            featured={featured}
            projects={allProjects}
        />
    );
}
