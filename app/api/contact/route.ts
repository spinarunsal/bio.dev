/**
 * Contact API — Contact form handler (POST /api/contact).
 *
 * Public endpoint — no authentication required.
 * Saves messages sent from the portfolio page's contact form.
 * Messages are associated with the relevant site (via siteSlug).
 * Status defaults to "new".
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const siteSlug = String(body?.siteSlug ?? "").trim();

    if (!name || !email || !message || !siteSlug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const site = await prisma.site.findUnique({ where: { slug: siteSlug } });
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    await prisma.contactMessage.create({
      data: { siteId: site.id, name, email, message },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
