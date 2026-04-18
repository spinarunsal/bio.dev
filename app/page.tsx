/**
 * Landing Page — Main marketing page of the application.
 *
 * Visitors see this page when they navigate to "/".
 * Content:
 * - Navbar (Login / Register buttons)
 * - Hero section (attention-grabbing headline, CTA buttons)
 * - Features section (3 feature cards: Panel, TR/EN, Analytics)
 * - Footer
 *
 * This page is server-side rendered (SSR) — important for SEO.
 * Lucide React icons are used (Sparkles, Globe, BarChart3, ArrowRight).
 */
import Link from "next/link";
import { Sparkles, Globe, BarChart3, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <div className="noise" />

      {/* Navigation bar */}
      <nav className="sticky top-0 z-50 glass-strong">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif-accent text-xl font-bold">bio.dev</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition">Sign In</Link>
            <Link href="/register" className="px-4 py-2 rounded-2xl bg-black text-white text-sm font-medium hover:opacity-80 transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-gray-600 mb-8">
          <Sparkles size={14} /> Professional portfolio platform
        </div>
        <h1 className="font-serif-accent text-4xl md:text-6xl font-bold leading-tight">
          Create your personal page<br />
          <span className="bg-gradient-to-r from-[--accent-rose] to-[#0a66c2] bg-clip-text text-transparent">
            in minutes
          </span>
        </h1>
        <p className="mt-6 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
          Showcase your projects in case study format, highlight your career,
          and share your public portfolio URL with the world.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/register" className="px-6 py-3 rounded-2xl bg-black text-white font-medium hover:opacity-80 transition flex items-center gap-2">
            Create Free Portfolio <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-6 glass rounded-2xl inline-flex items-center gap-2 px-5 py-2.5 text-sm text-gray-600">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          bio.dev/<span className="italic text-[--accent-rose]">your-name</span>
        </div>
      </section>

      {/* Features section — three key value propositions */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: <Sparkles size={20} />, title: "One Panel, Full Control", desc: "Profile, projects, links — manage everything from a single editor screen." },
            { icon: <Globe size={20} />, title: "TR / EN Support", desc: "Enter your content in Turkish and English, let visitors choose their language." },
            { icon: <BarChart3 size={20} />, title: "Visitor Analytics", desc: "Who is visiting your page? Referrer, device, and time-based statistics." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-3xl p-6 border border-white/40 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-xl bg-[--accent-rose-light] text-[--accent-rose] flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-400">
        © {new Date().getFullYear()} bio.dev — Portfolio platform
      </footer>
    </main>
  );
}
