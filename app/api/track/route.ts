/**
 * Track API — Anonymous visitor tracking (POST /api/track).
 *
 * Processes requests from the PageTracker component:
 * 1. Dashboard/admin pages are skipped
 * 2. Bot requests are filtered (user-agent regex)
 * 3. A SHA-256 fingerprint is generated from IP + User-Agent
 * 4. VisitorSession is upserted (unique visitor)
 * 5. A PageView record is created
 *
 * Does not use cookies — fingerprint-based tracking.
 * Personal data is kept to a minimum (IP is hashed).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const BOT_PATTERNS = /bot|crawl|spider|slurp|baiduspider|yandex|sogou|exabot|facebot|ia_archiver/i;

function hashFingerprint(ip: string, ua: string): string {
    return crypto
        .createHash("sha256")
        .update(`${ip}::${ua}`)
        .digest("hex")
        .slice(0, 32);
}

function parseIp(req: NextRequest): string {
    const xff = req.headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    const realIp = req.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    return "unknown";
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const path: string = body.path ?? "/";
        const referrer: string = body.referrer ?? "";
        const screenResolution: string = body.screenResolution ?? "";
        const language: string = body.language ?? "";
        const siteSlug: string = body.siteSlug ?? "";

        // Skip dashboard pages
        if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
            return NextResponse.json({ ok: true });
        }

        const userAgent = req.headers.get("user-agent") ?? "";
        if (BOT_PATTERNS.test(userAgent)) {
            return NextResponse.json({ ok: true });
        }

        // Find the site by slug
        let siteId: string | null = null;
        if (siteSlug) {
            const site = await prisma.site.findUnique({ where: { slug: siteSlug } });
            if (site) siteId = site.id;
        }

        if (!siteId) {
            return NextResponse.json({ ok: true }); // No site, skip tracking
        }

        const ip = parseIp(req);
        const fingerprint = hashFingerprint(ip, userAgent);

        // Upsert visitor session (unique per site + fingerprint)
        const session = await prisma.visitorSession.upsert({
            where: {
                siteId_fingerprint: { siteId, fingerprint },
            },
            create: {
                siteId,
                fingerprint,
                ip: ip.slice(0, 45),
                userAgent: userAgent.slice(0, 500),
                language: language.slice(0, 20),
                screenResolution: screenResolution.slice(0, 20),
            },
            update: {
                language: language.slice(0, 20),
                screenResolution: screenResolution.slice(0, 20),
            },
        });

        // Create page view
        await prisma.pageView.create({
            data: {
                siteId,
                path: path.slice(0, 500),
                referrer: referrer.slice(0, 1000),
                userAgent: userAgent.slice(0, 500),
                sessionId: session.id,
            },
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[track] Error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
