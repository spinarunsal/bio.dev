/**
 * Project Detail Page — Case study page (/[slug]/work/[projectSlug]).
 *
 * Detailed case study view for a single project:
 * - Header: Date, title, role, summary, tech stack pills
 * - Cover image (if available)
 * - 🔍 Problem section
 * - 💡 Solution section (bullet list — JSON array)
 * - 📊 Results section (accent glass grid — JSON array)
 *
 * generateMetadata: Produces dynamic SEO meta from the project title.
 * JSON.parse is used to parse stack/solution/results arrays.
 */
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ slug: string; projectSlug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, projectSlug } = await params;
  const site = await prisma.site.findUnique({ where: { slug } });
  if (!site) return {};
  const project = await prisma.project.findFirst({ where: { siteId: site.id, slug: projectSlug } });
  if (!project) return {};
  return { title: `${project.title} | ${site.title || slug}`, description: project.summary || "" };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug, projectSlug } = await params;
  const site = await prisma.site.findUnique({ where: { slug } });
  if (!site || !site.isPublished) notFound();
  const project = await prisma.project.findFirst({ where: { siteId: site.id, slug: projectSlug, isPublished: true } });
  if (!project) notFound();

  let stack: string[] = []; try { stack = JSON.parse(project.stack || "[]"); } catch {}
  let solution: string[] = []; try { solution = JSON.parse(project.solution || "[]"); } catch {}
  let results: string[] = []; try { results = JSON.parse(project.results || "[]"); } catch {}

  return (
    <main className="min-h-screen px-4 md:px-6 pb-16">
      <div className="noise" />
      <div className="max-w-3xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <Link href={`/${slug}`} className="font-serif-accent text-xl font-bold hover:text-[--accent-rose] transition">{site.title || slug}</Link>
          <Link href={`/${slug}/work`} className="text-sm text-gray-500 hover:text-gray-800 transition">← Projects</Link>
        </div>

        <div className="glass glass-highlight rounded-3xl p-8 border border-white/40 bg-white/20 mb-8">
          <p className="text-sm text-gray-500 mb-2">{new Date(project.date).toLocaleDateString("tr-TR", { year: "numeric", month: "long" })}</p>
          <h1 className="font-serif-accent text-3xl font-bold mb-2">{project.title}</h1>
          {project.role && <p className="text-lg text-gray-500">{project.role}</p>}
          {project.summary && <p className="text-gray-600 mt-4 leading-relaxed">{project.summary}</p>}
          {stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {stack.map(t => (<span key={t} className="skill-pill px-3 py-1 rounded-xl text-xs font-medium">{t}</span>))}
            </div>
          )}
        </div>

        {project.cover && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-white/40 shadow-lg">
            <img src={project.cover} alt={project.title} className="w-full h-auto" />
          </div>
        )}

        <div className="space-y-8">
          {project.problem && (
            <div className="glass rounded-2xl p-6 border border-white/40 bg-white/20">
              <h2 className="font-serif-accent text-xl font-semibold mb-3 flex items-center gap-2">🔍 Problem</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{project.problem}</p>
            </div>
          )}
          {solution.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-white/40 bg-white/20">
              <h2 className="font-serif-accent text-xl font-semibold mb-3 flex items-center gap-2">💡 Solution</h2>
              <ul className="space-y-2">
                {solution.map((s, i) => (<li key={i} className="text-gray-600 leading-relaxed flex gap-2"><span className="text-[--accent-rose]">•</span> {s}</li>))}
              </ul>
            </div>
          )}
          {results.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-white/40 bg-white/20">
              <h2 className="font-serif-accent text-xl font-semibold mb-3 flex items-center gap-2">📊 Results</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {results.map((r, i) => (<div key={i} className="glass-accent rounded-xl p-4 text-gray-600 text-sm">{r}</div>))}
              </div>
            </div>
          )}
        </div>

        <footer className="mt-14 text-center text-xs text-gray-400">
          <Link href="/" className="hover:text-[--accent-rose] transition">bio.dev</Link> — Built with bio.dev
        </footer>
      </div>
    </main>
  );
}
