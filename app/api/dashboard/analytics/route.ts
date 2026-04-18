/**
 * Analytics API — Visitor statistics (GET /api/dashboard/analytics?days=N).
 *
 * Provides data for the Analytics tab in the dashboard:
 * - totalViews: Total page views of all time
 * - periodViews: Views in the selected period (7/14/30 days)
 * - uniqueVisitors: Unique visitor count (fingerprint-based)
 * - viewsByDay: Daily views chart data
 * - referrers: Top referral sources (top 10)
 * - topPages: Most visited pages (top 10)
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(req: Request) {
    const { session, error } = await requireAuth();
    if (error) return error;

    const site = await prisma.site.findFirst({
        where: { userId: session!.user.id },
    });
    if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "7");

    const since = new Date();
    since.setDate(since.getDate() - days);

    // Total views
    const totalViews = await prisma.pageView.count({
        where: { siteId: site.id },
    });

    // Views in period
    const periodViews = await prisma.pageView.count({
        where: {
            siteId: site.id,
            createdAt: { gte: since },
        },
    });

    // Unique visitors
    const uniqueVisitors = await prisma.visitorSession.count({
        where: { siteId: site.id },
    });

    // Recent views by day
    const recentViews = await prisma.pageView.findMany({
        where: {
            siteId: site.id,
            createdAt: { gte: since },
        },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
    });

    // Group by day
    const viewsByDay: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        viewsByDay[d.toISOString().split("T")[0]] = 0;
    }
    recentViews.forEach((v) => {
        const day = v.createdAt.toISOString().split("T")[0];
        if (viewsByDay[day] !== undefined) viewsByDay[day]++;
    });

    // Top referrers
    const referrers = await prisma.pageView.groupBy({
        by: ["referrer"],
        where: {
            siteId: site.id,
            referrer: { not: "" },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
    });

    // Top pages
    const topPages = await prisma.pageView.groupBy({
        by: ["path"],
        where: { siteId: site.id },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 10,
    });

    return NextResponse.json({
        totalViews,
        periodViews,
        uniqueVisitors,
        viewsByDay: Object.entries(viewsByDay).map(([date, count]) => ({
            date,
            count,
        })),
        referrers: referrers.map((r) => ({
            referrer: r.referrer,
            count: r._count.id,
        })),
        topPages: topPages.map((p) => ({
            path: p.path,
            count: p._count.id,
        })),
    });
}
