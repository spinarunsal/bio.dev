/**
 * Work Listing Page — List of all projects (/[slug]/work).
 *
 * Lists all of the user's published projects ordered by date.
 * Each project is displayed in a glassmorphism card:
 * - Title, role, date, summary, tech stack pills
 * - Clicking navigates to the project detail page (/[slug]/work/[projectSlug])
 *
 * Server-side rendered (SSR) — SEO friendly.
 */
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ slug: string }>; }

export default async function PublicWorkPage({ params }: Props) {
  const { slug } = await params;
  const site = await prisma.site.findUnique({ where: { slug } });
  if (!site || !site.isPublished) notFound();
  const projects = await prisma.project.findMany({ where: { siteId: site.id, isPublished: true }, orderBy: { date: "desc" } });

  return (
    <main className="min-h-screen px-4 md:px-6 pb-16">
      <div className="noise" />
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <Link href={`/${slug}`} className="font-serif-accent text-xl font-bold hover:text-[--accent-rose] transition">{site.title || slug}</Link>
          <Link href={`/${slug}`} className="text-sm text-gray-500 hover:text-gray-800 transition">← Home</Link>
        </div>
        <h1 className="font-serif-accent text-3xl font-bold mb-8">Projects</h1>
        {projects.length === 0 ? <p className="text-gray-500 text-sm">No projects yet.</p> : (
          <div className="space-y-4">
            {projects.map(p => {
              let stack: string[] = []; try { stack = JSON.parse(p.stack || "[]"); } catch {}
              return (
                <Link key={p.id} href={`/${slug}/work/${p.slug}`} className="block glass rounded-2xl p-6 border border-white/40 bg-white/20 hover:bg-white/30 hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-[--accent-rose] transition">{p.title}</h3>
                      {p.role && <p className="text-sm text-gray-500 mt-1">{p.role}</p>}
                    </div>
                    <span className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString("tr-TR", { year: "numeric", month: "short" })}</span>
                  </div>
                  {p.summary && <p className="text-sm text-gray-500 mt-3 line-clamp-2">{p.summary}</p>}
                  {stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {stack.map(t => (<span key={t} className="skill-pill px-2 py-0.5 rounded-lg text-[10px] font-medium">{t}</span>))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
