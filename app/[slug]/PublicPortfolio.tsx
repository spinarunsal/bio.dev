/**
 * PublicPortfolio — Public portfolio UI component (Client Component).
 *
 * This file contains the entire visual interface of the portfolio page:
 * - Language switcher (TR/EN toggle)
 * - Hero section (title + typing animation + subtitle)
 * - Skills section (categorized skill pills)
 * - About section (markdown text)
 * - Featured projects (grid cards)
 * - Identity cards (music, animal love, etc. — glassmorphism)
 * - Contact CTA (social links)
 * - Footer
 *
 * Helper components:
 * - useTypingAnimation(): Typewriter effect hook (type/delete)
 * - FadeSection(): Fade-in animation on scroll (Framer Motion)
 * - AnimatedCounter(): Number animation
 *
 * pick(tr, en, fallback) function: Selects the correct text based on language.
 * If English text is missing, falls back to Turkish.
 */
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Briefcase, User, Mail, Music, PawPrint } from "lucide-react";
import type { Site, SiteContent, SiteSettings, Project } from "@prisma/client";

interface Props {
  site: Site;
  content: SiteContent | null;
  settings: SiteSettings | null;
  featured: Project[];
  projects: Project[];
}

function useTypingAnimation(lines: string[], speed = 60, pause = 2000) {
  const [text, setText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    if (lines.length === 0) return;
    const cur = lines[lineIndex] || "";
    if (!isDeleting && charIndex < cur.length) { const t = setTimeout(() => { setText(cur.slice(0, charIndex + 1)); setCharIndex(charIndex + 1); }, speed); return () => clearTimeout(t); }
    if (!isDeleting && charIndex === cur.length) { const t = setTimeout(() => setIsDeleting(true), pause); return () => clearTimeout(t); }
    if (isDeleting && charIndex > 0) { const t = setTimeout(() => { setText(cur.slice(0, charIndex - 1)); setCharIndex(charIndex - 1); }, speed / 2); return () => clearTimeout(t); }
    if (isDeleting && charIndex === 0) { setIsDeleting(false); setLineIndex((lineIndex + 1) % lines.length); }
  }, [charIndex, isDeleting, lineIndex, lines, speed, pause]);
  return text;
}

function FadeSection({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (<motion.section id={id} ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className={className}>{children}</motion.section>);
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center">
      <div className="counter-value text-3xl md:text-4xl font-bold font-serif-accent">{value}</div>
      <div className="mt-1 text-xs text-gray-500 uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

export default function PublicPortfolio({ site, content, settings, featured, projects }: Props) {
  const [lang, setLang] = useState<"tr" | "en">(site.langDefault === "en" ? "en" : "tr");
  const isEn = lang === "en";
  const baseUrl = `/${site.slug}`;

  const pick = (tr: string | null | undefined, en: string | null | undefined, fallback = "") => {
    const v = isEn ? en || tr : tr;
    return v?.trim() || fallback;
  };

  let typingLines: string[] = [];
  try { const raw = isEn ? content?.typingLinesJsonEn : content?.typingLinesJson; const p = JSON.parse(raw || "[]"); if (Array.isArray(p)) typingLines = p; } catch { }
  const typedText = useTypingAnimation(typingLines);

  let skillCategories: { label: string; items: string[] }[] = [];
  try { const raw = isEn ? content?.skillsJsonEn : content?.skillsJson; const p = JSON.parse(raw || "[]"); if (Array.isArray(p)) skillCategories = p; } catch { }

  return (
    <main className="min-h-screen px-4 md:px-6 pb-16">
      <div className="noise" />
      {/* Language toggle */}
      <div className="max-w-6xl mx-auto pt-4 flex justify-end">
        <div className="flex rounded-xl bg-white/30 border border-white/50 p-0.5">
          {(["tr", "en"] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${lang === l ? "bg-[--accent-rose] text-white" : "text-gray-500 hover:text-gray-800"}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-4">
        {/* Hero */}
        <FadeSection className="glass glass-highlight rounded-3xl p-8 md:p-12 border border-white/40 bg-white/20">
          <h1 className="font-serif-accent text-2xl md:text-4xl font-bold leading-tight">
            {pick(content?.homeHeroTitle, content?.homeHeroTitleEn)}
          </h1>
          {typingLines.length > 0 && (
            <p className="mt-4 text-lg md:text-xl text-gray-600 h-8 flex items-center">
              <span className="typing-cursor">{typedText}</span>
            </p>
          )}
          {pick(content?.homeHeroSubtitle, content?.homeHeroSubtitleEn) && (
            <p className="mt-3 text-sm text-gray-500 max-w-2xl leading-relaxed">
              {pick(content?.homeHeroSubtitle, content?.homeHeroSubtitleEn)}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            {projects.length > 0 && (
              <Link href={`${baseUrl}/work`} className="group flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white/30 border border-white/50 hover:bg-white/50 transition-all">
                <Briefcase size={13} strokeWidth={1.5} /> {isEn ? "Work" : "İşler"} <span className="text-xs text-gray-400">→</span>
              </Link>
            )}
            {(settings?.socialLink1Url || settings?.linkedin || settings?.socialLink2Url || settings?.github) && (
              <a href="#contact" className="group flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white/30 border border-white/50 hover:bg-white/50 transition-all">
                <Mail size={13} strokeWidth={1.5} /> {isEn ? "Contact" : "İletişim"} <span className="text-xs text-gray-400">→</span>
              </a>
            )}
          </div>
        </FadeSection>


        {/* Skills */}
        {skillCategories.length > 0 && (
          <FadeSection className="mt-8 glass rounded-3xl p-7 md:p-8 border border-white/40 bg-white/20">
            <h2 className="font-serif-accent text-2xl font-semibold">{isEn ? "Skills" : "Yetenekler"}</h2>
            <div className="mt-6 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {skillCategories.map(cat => (
                <div key={cat.label}>
                  <div className="text-sm font-medium text-gray-600 mb-3">{cat.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(item => (<span key={item} className="skill-pill px-3 py-1.5 rounded-xl text-xs font-medium">{item}</span>))}
                  </div>
                </div>
              ))}
            </div>
          </FadeSection>
        )}

        {/* About */}
        {pick(content?.aboutMarkdown, content?.aboutMarkdownEn) && (
          <FadeSection className="mt-8 glass rounded-3xl p-7 border border-white/40 bg-white/20">
            <h2 className="font-serif-accent text-2xl font-semibold mb-4">{isEn ? "About" : "Hakkımda"}</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{pick(content?.aboutMarkdown, content?.aboutMarkdownEn)}</p>
          </FadeSection>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <FadeSection className="mt-8 glass rounded-3xl p-7 border border-white/40 bg-white/20">
            <h2 className="font-serif-accent text-2xl font-semibold">{isEn ? "Featured" : "Öne Çıkanlar"}</h2>
            <p className="mt-2 text-sm text-gray-500">{pick(content?.featuredDescription, content?.featuredDescriptionEn)}</p>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {featured.map(p => {
                let stack: string[] = []; try { stack = JSON.parse(p.stack || "[]"); } catch { }
                return (
                  <div key={p.id} className="rounded-2xl border border-white/40 bg-white/20 hover:bg-white/30 transition-all p-5 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-base">{pick(p.title, p.titleEn)}</div>
                        {(p.role || p.roleEn) && <div className="text-xs text-gray-400 mt-1">{pick(p.role, p.roleEn)}</div>}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 line-clamp-2">{pick(p.summary, p.summaryEn)}</p>
                    {stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {stack.slice(0, 5).map(t => (<span key={t} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-white/40 border border-white/50 text-gray-500">{t}</span>))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </FadeSection>
        )}

        {/* Identity */}
        {(content?.musicTitle || content?.animalTitle) && (
          <FadeSection className="mt-8">
            <div className="grid md:grid-cols-2 gap-5">
              {content?.musicTitle && (
                <motion.div whileHover={{ y: -3 }} className="glass-accent rounded-3xl p-6">
                  <Music size={20} strokeWidth={1.5} className="mb-2 text-[--accent-rose]" />
                  <h3 className="font-serif-accent text-lg font-semibold">{pick(content.musicTitle, content.musicTitleEn)}</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{pick(content.musicContent, content.musicContentEn)}</p>
                </motion.div>
              )}
              {content?.animalTitle && (
                <motion.div whileHover={{ y: -3 }} className="glass-accent rounded-3xl p-6">
                  <PawPrint size={20} strokeWidth={1.5} className="mb-2 text-[--accent-rose]" />
                  <h3 className="font-serif-accent text-lg font-semibold">{pick(content.animalTitle, content.animalTitleEn)}</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{pick(content.animalContent, content.animalContentEn)}</p>
                </motion.div>
              )}
            </div>
          </FadeSection>
        )}

        {/* Contact CTA */}
        {(settings?.socialLink1Url || settings?.linkedin || settings?.socialLink2Url || settings?.github) && (
          <FadeSection id="contact" className="mt-8 glass rounded-3xl p-7 md:p-8 border border-white/40 bg-white/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="font-serif-accent text-2xl font-semibold flex items-center gap-2">
                {isEn ? "Let\u2019s Talk" : "İletişime Geçin"}
              </h2>
              <div className="flex flex-wrap gap-3">
                {(settings?.socialLink1Url || settings?.linkedin) && <a href={settings.socialLink1Url || settings.linkedin} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-2xl border border-white/50 bg-white/25 hover:bg-white/35 transition text-sm font-medium">{settings.socialLink1Title || "LinkedIn"}</a>}
                {(settings?.socialLink2Url || settings?.github) && <a href={settings.socialLink2Url || settings.github} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-2xl border border-white/50 bg-white/25 hover:bg-white/35 transition text-sm font-medium">{settings.socialLink2Title || "GitHub"}</a>}
              </div>
            </div>
          </FadeSection>
        )}

        {/* Footer */}
        <footer className="mt-14 text-center text-xs text-gray-400">
          <span>♪</span>
          <span className="mx-2">© {new Date().getFullYear()} {pick(content?.homeHeroTitle, content?.homeHeroTitleEn, site.title)}</span>
          <span>—</span>
          <span className="ml-2">Built with <Link href="/" className="hover:text-[--accent-rose] transition">bio.dev</Link></span>
        </footer>
      </div>
    </main>
  );
}
