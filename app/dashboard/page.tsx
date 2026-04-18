/**
 * Dashboard Page — Single-page admin panel (/dashboard).
 *
 * All dashboard tabs and components are defined in this file (~760 lines).
 * Architecture decision: A single file was chosen to keep state local
 * and simplify component communication.
 *
 * Layout: Split-panel design
 * - Left panel (50%): Tabbed editor (Profile, Projects, Settings, Analytics)
 * - Right panel (50%): Live preview (updates as you type)
 *
 * Tab components:
 * - ProfileTab: Edit hero, skills, about, contact links
 * - ProjectsTab: Project CRUD (add/edit/delete), case study fields
 * - SettingsTab: Site settings, social media, availability status (PRO)
 * - AnalyticsTab: Visitor statistics, charts (PRO)
 *
 * Shared components: Header, Card, SaveBtn, LangSwitch, Toast, Loading
 *
 * Auto-save: Active in ProfileTab with 800ms debounce.
 */
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  User, FolderOpen, Settings, BarChart3, LogOut, ExternalLink,
  Plus, Pencil, Trash2, X, Check, Eye, Users, TrendingUp, Copy, RefreshCw, Lock, Crown,
} from "lucide-react";

/* ───── types ─────  */
type Tab = "profile" | "projects" | "settings" | "analytics";
type Project = any;
const emptyProject: Project = {
  slug: "", title: "", titleEn: "", role: "", roleEn: "",
  summary: "", summaryEn: "", stack: "[]", problem: "", problemEn: "",
  solution: "[]", solutionEn: "[]", results: "[]", resultsEn: "[]",
  cover: "", isFeatured: false, isPublished: true,
};

/* ═══════════════════════════════════════════════════════════════ */
/*  MAIN DASHBOARD COMPONENT                                      */
/* ═══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { data: session } = useSession();
  const siteSlug = (session?.user as any)?.siteSlug || "";
  const [tab, setTab] = useState<Tab>("profile");
  const [profileData, setProfileData] = useState<any>(null);

  /** Dashboard navigation tabs — Settings and Analytics are locked behind PRO tier */
  const tabs: { id: Tab; label: string; icon: any; pro?: boolean }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "settings", label: "Settings", icon: Settings, pro: true },
    { id: "analytics", label: "Analytics", icon: BarChart3, pro: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="noise" />
      {/* Dashboard header with tab navigation */}
      <header className="h-12 shrink-0 bg-white/70 backdrop-blur-xl border-b border-gray-200/60 px-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-serif-accent text-base font-bold text-gray-800">bio.dev</Link>
          <nav className="flex items-center gap-0.5">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => !t.pro && setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${t.pro ? "text-gray-300 cursor-not-allowed" : tab === t.id ? "bg-[--accent-rose-light] text-[--accent-rose]" : "text-gray-500 hover:bg-white/50 hover:text-gray-800"
                  }`}>
                <t.icon size={14} strokeWidth={1.5} />
                {t.label}
                {t.pro && <span className="ml-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white leading-none">PRO</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {/* Link to public portfolio page */}
          {siteSlug && (
            <a href={`/${siteSlug}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-[--accent-rose] transition font-mono">
              bio.dev/{siteSlug} <ExternalLink size={10} />
            </a>
          )}
          <span className="text-xs text-gray-500 truncate max-w-[120px]">{session?.user?.name || session?.user?.email}</span>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition" title="Sign Out">
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Split-panel layout: editor (left) + live preview (right) */}
      <div className="flex-1 flex" style={{ height: "calc(100vh - 48px)" }}>
        <div className="w-1/2 border-r border-gray-200/40 overflow-y-auto p-5">
          {tab === "profile" && <ProfileTab onDataChange={setProfileData} />}
          {tab === "projects" && <ProjectsTab onSave={() => { }} />}
          {tab === "settings" && <SettingsTab onSave={() => { }} />}
          {tab === "analytics" && <AnalyticsTab />}
        </div>

        <div className="w-1/2 flex flex-col bg-gray-50/50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200/60 bg-white/60 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Eye size={12} /> Live Preview
            </div>
            <a href={`/${siteSlug}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 transition font-mono">
              /{siteSlug} <ExternalLink size={10} />
            </a>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <LivePreview data={profileData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROFILE TAB — Edit hero, skills, about, and contact links.
   Features auto-save with 800ms debounce for a seamless editing experience.
   ═══════════════════════════════════════════════════════════════ */
function ProfileTab({ onDataChange }: { onDataChange: (d: any) => void }) {
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const loaded = useRef(false);
  const debounceRef = useRef<any>(null);

  /** Fetch content and settings on mount, merge into single state object */
  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/content").then((r) => r.json()),
      fetch("/api/dashboard/settings").then((r) => r.json()),
    ]).then(([cd, sd]) => {
      const c = cd.content || {};
      const s = sd.settings || {};
      const merged = { ...c, contactLink1Title: s.socialLink1Title || "", contactLink1Url: s.socialLink1Url || s.linkedin || "", contactLink2Title: s.socialLink2Title || "", contactLink2Url: s.socialLink2Url || s.github || "" };
      setData(merged);
      onDataChange(merged);
      setTimeout(() => { loaded.current = true; }, 100);
    });
  }, []);

  /** Notify parent of data changes for live preview */
  useEffect(() => {
    if (data) onDataChange(data);
  }, [data]);

  /** Strip contact link fields before saving to content API */
  const contentOnly = (d: any) => {
    const { contactLink1Title, contactLink1Url, contactLink2Title, contactLink2Url, ...rest } = d;
    return rest;
  };

  /** Auto-save with 800ms debounce — saves both content and settings */
  useEffect(() => {
    if (!loaded.current || !data) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      const contentRes = await fetch("/api/dashboard/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contentOnly(data)) });
      await fetch("/api/dashboard/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settingsData: { linkedin: data.contactLink1Url, github: data.contactLink2Url, socialLink1Title: data.contactLink1Title, socialLink1Url: data.contactLink1Url, socialLink2Title: data.contactLink2Title, socialLink2Url: data.contactLink2Url } }) });
      setSaving(false);
    }, 800);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [data]);

  /** Manual save handler — bypasses debounce */
  const save = async () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaving(true); setMsg("");
    const res = await fetch("/api/dashboard/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contentOnly(data)) });
    await fetch("/api/dashboard/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settingsData: { linkedin: data.contactLink1Url, github: data.contactLink2Url, socialLink1Title: data.contactLink1Title, socialLink1Url: data.contactLink1Url, socialLink2Title: data.contactLink2Title, socialLink2Url: data.contactLink2Url } }) });
    setSaving(false);
    setMsg(res.ok ? "Saved!" : "Error occurred");
    setTimeout(() => setMsg(""), 3000);
  };

  if (!data) return <Loading />;

  const isEn = lang === "en";
  /** Reusable field renderer — switches between TR/EN keys based on current language */
  const field = (label: string, key: string, keyEn: string, textarea = false) => {
    const k = isEn ? keyEn : key;
    const Tag = textarea ? "textarea" : "input";
    return (
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
        <Tag value={data[k] || ""} onChange={(e: any) => setData({ ...data, [k]: e.target.value })}
          className={`w-full px-3 py-2 rounded-xl bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] focus:ring-1 focus:ring-[--accent-rose] outline-none transition text-sm ${textarea ? "min-h-[80px] resize-y" : ""}`} />
      </div>
    );
  };

  // Safe typing lines helper — converts between JSON array and comma-separated text
  const typingKey = isEn ? "typingLinesJsonEn" : "typingLinesJson";
  let typingLines: string[] = [];
  try { const p = JSON.parse(data[typingKey] || "[]"); if (Array.isArray(p)) typingLines = p; } catch { }
  const typingText = typingLines.join(", ");

  // Skills categories — parsed from JSON string
  const skillsKey = isEn ? "skillsJsonEn" : "skillsJson";
  let skillCategories: { label: string; items: string[] }[] = [];
  try { const p = JSON.parse(data[skillsKey] || "[]"); if (Array.isArray(p)) skillCategories = p; } catch { }

  /** Update skills JSON and trigger state change */
  const updateSkills = (cats: { label: string; items: string[] }[]) => {
    setData({ ...data, [skillsKey]: JSON.stringify(cats) });
  };

  return (
    <>
      <Header title="Edit Profile" extra={
        <>
          <LangSwitch lang={lang} setLang={setLang} />
          <SaveBtn saving={saving} onClick={save} />
        </>
      } />
      <Toast msg={msg} />
      <div className="space-y-4 mt-4">
        <Card title="Hero">
          {field("Title", "homeHeroTitle", "homeHeroTitleEn")}
          {field("Subtitle", "homeHeroSubtitle", "homeHeroSubtitleEn")}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Typing Lines</label>
            <input
              value={typingText}
              onChange={(e: any) => {
                const lines = e.target.value.split(",").map((l: string) => l.trim()).filter((l: string) => l !== "");
                setData({ ...data, [typingKey]: JSON.stringify(lines) });
              }}
              placeholder="Software Developer, Project Manager, Brand Strategist"
              className="w-full px-3 py-2 rounded-xl bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] focus:ring-1 focus:ring-[--accent-rose] outline-none transition text-sm" />
            <div className="text-[10px] text-gray-400 mt-1">Separate with commas. Displayed sequentially on screen.</div>
          </div>
        </Card>
        <Card title="Skills">
          <div className="space-y-3">
            {skillCategories.map((cat, idx) => (
              <div key={idx} className="glass rounded-xl p-3 space-y-2 border border-white/40">
                <div className="flex items-center justify-between">
                  <input
                    value={cat.label}
                    onChange={(e: any) => { const c = [...skillCategories]; c[idx] = { ...c[idx], label: e.target.value }; updateSkills(c); }}
                    placeholder="Category name (e.g. Marketing)"
                    className="px-2.5 py-1.5 rounded-lg bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] outline-none transition text-xs font-medium w-40" />
                  <button onClick={() => { const c = [...skillCategories]; c.splice(idx, 1); updateSkills(c); }}
                    className="p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition" title="Delete category">
                    <X size={12} />
                  </button>
                </div>
                <input
                  value={(cat.items || []).join(", ")}
                  onChange={(e: any) => { const c = [...skillCategories]; c[idx] = { ...c[idx], items: e.target.value.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "") }; updateSkills(c); }}
                  placeholder="Google Ads, SEO, Content Marketing"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] outline-none transition text-xs" />
              </div>
            ))}
            <button onClick={() => updateSkills([...skillCategories, { label: "", items: [] }])}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-[--accent-rose] transition px-2 py-1">
              <Plus size={12} /> Add Category
            </button>
          </div>
        </Card>
        <Card title="About">
          {field("About (Markdown)", "aboutMarkdown", "aboutMarkdownEn", true)}
        </Card>
        <Card title="Featured">
          {field("Description", "featuredDescription", "featuredDescriptionEn", true)}
        </Card>
        <Card title="Contact">
          <div className="glass rounded-xl p-3 space-y-2 border border-white/40">
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Link 1</div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <input value={data.contactLink1Title || ""} onChange={(e: any) => setData({ ...data, contactLink1Title: e.target.value })}
                placeholder="LinkedIn" className="px-2.5 py-1.5 rounded-lg bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] outline-none transition text-xs" />
              <input value={data.contactLink1Url || ""} onChange={(e: any) => setData({ ...data, contactLink1Url: e.target.value })}
                placeholder="https://linkedin.com/in/..." className="px-2.5 py-1.5 rounded-lg bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] outline-none transition text-xs" />
            </div>
          </div>
          <div className="glass rounded-xl p-3 space-y-2 border border-white/40">
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Link 2</div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <input value={data.contactLink2Title || ""} onChange={(e: any) => setData({ ...data, contactLink2Title: e.target.value })}
                placeholder="GitHub" className="px-2.5 py-1.5 rounded-lg bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] outline-none transition text-xs" />
              <input value={data.contactLink2Url || ""} onChange={(e: any) => setData({ ...data, contactLink2Url: e.target.value })}
                placeholder="https://github.com/..." className="px-2.5 py-1.5 rounded-lg bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] outline-none transition text-xs" />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIVE PREVIEW — Shows a real-time preview of the portfolio as the user edits.
   Renders the same sections as the public portfolio page.
   ═══════════════════════════════════════════════════════════════ */
function LivePreview({ data }: { data: any }) {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/projects").then(r => r.json()).then(d => setProjects(d.projects || []));
  }, []);

  if (!data) return <div className="text-sm text-gray-400 text-center py-8">Loading...</div>;

  let typingLines: string[] = [];
  try { const p = JSON.parse(data.typingLinesJson || "[]"); if (Array.isArray(p)) typingLines = p; } catch { }

  let skillCategories: { label: string; items: string[] }[] = [];
  try { const p = JSON.parse(data.skillsJson || "[]"); if (Array.isArray(p)) skillCategories = p; } catch { }

  const featured = projects.filter((p: any) => p.isFeatured && p.isPublished);

  return (
    <div className="space-y-6">
      {/* Hero preview */}
      <div className="glass glass-highlight rounded-3xl p-8 border border-white/40 bg-white/20">
        <h1 className="font-serif-accent text-2xl font-bold leading-tight">
          {data.homeHeroTitle || "Title"}
        </h1>
        {typingLines.length > 0 && (
          <p className="mt-4 text-lg text-gray-600 h-8 flex items-center">
            <span className="typing-cursor">{typingLines[0]}</span>
          </p>
        )}
        {data.homeHeroSubtitle && (
          <p className="mt-3 text-sm text-gray-500 max-w-2xl leading-relaxed">{data.homeHeroSubtitle}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {projects.length > 0 && (
            <span className="group flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white/30 border border-white/50">
              Work <span className="text-xs text-gray-400">→</span>
            </span>
          )}
          {(data.contactLink1Url || data.contactLink2Url) && (
            <span className="group flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-white/30 border border-white/50">
              Contact <span className="text-xs text-gray-400">→</span>
            </span>
          )}
        </div>
      </div>

      {/* Skills preview */}
      {skillCategories.length > 0 && (
        <div className="glass rounded-3xl p-7 border border-white/40 bg-white/20">
          <h2 className="font-serif-accent text-2xl font-semibold">Skills</h2>
          <div className="mt-6 grid gap-5 grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((cat: any) => (
              <div key={cat.label}>
                <div className="text-sm font-medium text-gray-600 mb-3">{cat.label}</div>
                <div className="flex flex-wrap gap-2">
                  {(cat.items || []).map((item: string) => (
                    <span key={item} className="skill-pill px-3 py-1.5 rounded-xl text-xs font-medium">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About preview */}
      {data.aboutMarkdown && (
        <div className="glass rounded-3xl p-7 border border-white/40 bg-white/20">
          <h2 className="font-serif-accent text-2xl font-semibold mb-4">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{data.aboutMarkdown}</p>
        </div>
      )}

      {/* Featured projects preview */}
      {(data.featuredDescription || featured.length > 0) && (
        <div className="glass rounded-3xl p-7 border border-white/40 bg-white/20">
          <h2 className="font-serif-accent text-2xl font-semibold">Featured</h2>
          {data.featuredDescription && (
            <p className="mt-2 text-sm text-gray-500">{data.featuredDescription}</p>
          )}
          {featured.length > 0 && (
            <div className="mt-6 grid gap-4">
              {featured.map((p: any) => {
                let stack: string[] = []; try { stack = JSON.parse(p.stack || "[]"); } catch { }
                return (
                  <div key={p.id} className="group rounded-2xl border border-white/40 bg-white/20 hover:bg-white/30 transition-all p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-base group-hover:text-[--accent-rose] transition-colors">{p.title}</div>
                        {p.role && <div className="text-xs text-gray-400 mt-1">{p.role}</div>}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">→</span>
                    </div>
                    {p.summary && <p className="text-sm text-gray-500 mt-3 line-clamp-2">{p.summary}</p>}
                    {stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {stack.slice(0, 5).map((t: string) => (
                          <span key={t} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-white/40 border border-white/50 text-gray-500">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Contact CTA preview */}
      {(data.contactLink1Url || data.contactLink2Url) && (
        <div className="glass rounded-3xl p-7 border border-white/40 bg-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="font-serif-accent text-2xl font-semibold">Get in Touch</h2>
            <div className="flex flex-wrap gap-3">
              {data.contactLink1Url && (
                <span className="px-5 py-2.5 rounded-2xl border border-white/50 bg-white/25 text-sm font-medium">
                  {data.contactLink1Title || "LinkedIn"}
                </span>
              )}
              {data.contactLink2Url && (
                <span className="px-5 py-2.5 rounded-2xl border border-white/50 bg-white/25 text-sm font-medium">
                  {data.contactLink2Title || "GitHub"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer preview */}
      <footer className="mt-8 text-center text-xs text-gray-400">
        <span>♪</span>
        <span className="mx-2">© {new Date().getFullYear()} {data.homeHeroTitle}</span>
        <span>—</span>
        <span className="ml-2">Built with bio.dev</span>
      </footer>
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════════
   PROJECTS TAB — CRUD operations for portfolio projects.
   Supports creating, editing, and deleting projects with case study fields.
   ═══════════════════════════════════════════════════════════════ */
function ProjectsTab({ onSave }: { onSave: () => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  /** Fetch all projects from the API */
  const load = useCallback(() => {
    fetch("/api/dashboard/projects").then((r) => r.json()).then((d) => setProjects(d.projects || []));
  }, []);
  useEffect(() => { load(); }, [load]);

  /** Save project (create or update) */
  const save = async () => {
    setSaving(true);
    const url = isNew ? "/api/dashboard/projects" : `/api/dashboard/projects/${editing!.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setSaving(false);
    if (res.ok) { setEditing(null); setIsNew(false); load(); setMsg("Saved!"); onSave(); setTimeout(() => setMsg(""), 3000); }
  };

  /** Delete project with confirmation dialog */
  const del = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await fetch(`/api/dashboard/projects/${id}`, { method: "DELETE" });
    load(); onSave();
  };

  const isEn = lang === "en";
  /** Bilingual field renderer for project editing */
  const field = (label: string, key: string, keyEn: string, textarea = false) => {
    if (!editing) return null;
    const k = isEn ? keyEn : key;
    const Tag = textarea ? "textarea" : "input";
    return (
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
        <Tag value={editing[k] || ""} onChange={(e: any) => setEditing({ ...editing, [k]: e.target.value })}
          className={`w-full px-3 py-2 rounded-xl bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] outline-none transition text-sm ${textarea ? "min-h-[60px] resize-y" : ""}`} />
      </div>
    );
  };

  // Project editing form
  if (editing) {
    return (
      <>
        <Header title={isNew ? "New Project" : "Edit Project"} extra={
          <>
            <LangSwitch lang={lang} setLang={setLang} />
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"><X size={16} /></button>
            <SaveBtn saving={saving} onClick={save} />
          </>
        } />
        <div className="space-y-4 mt-4">
          <Card title="Basic Info">
            {isNew && (
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Slug</label>
                <input value={editing.slug || ""} onChange={(e: any) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  className="w-full px-3 py-2 rounded-xl bg-white/50 border border-gray-200/60 outline-none text-sm" />
              </div>
            )}
            {field("Title", "title", "titleEn")}
            {field("Role", "role", "roleEn")}
            {field("Summary", "summary", "summaryEn", true)}
            {field("Cover Image URL", "cover", "cover")}
            {field("Tech Stack (JSON)", "stack", "stack", true)}
          </Card>
          <Card title="Case Study">
            {field("Problem", "problem", "problemEn", true)}
            {field("Solution (JSON)", "solution", "solutionEn", true)}
            {field("Results (JSON)", "results", "resultsEn", true)}
          </Card>
          <Card title="Status">
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.isFeatured} onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })} className="rounded" /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.isPublished} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} className="rounded" /> Published
              </label>
            </div>
          </Card>
        </div>
      </>
    );
  }

  // Project listing view
  return (
    <>
      <Header title="Projects" extra={
        <button onClick={() => { setEditing({ ...emptyProject }); setIsNew(true); }}
          className="px-3 py-1.5 rounded-xl bg-black text-white text-xs font-medium hover:opacity-80 transition flex items-center gap-1.5">
          <Plus size={13} /> New
        </button>
      } />
      <Toast msg={msg} />
      <div className="space-y-2 mt-4">
        {projects.map((p) => (
          <div key={p.id} className="glass rounded-xl p-4 border border-white/40 flex items-center justify-between group">
            <div>
              <div className="font-medium text-sm">{p.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{p.role} · {p.slug}</div>
              <div className="flex gap-1.5 mt-1.5">
                {p.isFeatured && <span className="px-1.5 py-0.5 rounded text-[10px] bg-[--accent-rose-light] text-[--accent-rose]">Featured</span>}
                {p.isPublished
                  ? <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-50 text-green-600">Published</span>
                  : <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500">Draft</span>}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => { setEditing(p); setIsNew(false); }} className="p-1.5 rounded-lg hover:bg-white/50 text-gray-500 transition"><Pencil size={14} /></button>
              <button onClick={() => del(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <div className="text-sm text-gray-400 text-center py-8">No projects yet.</div>}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS TAB — Site configuration, social links, and metrics.
   Manages both the Site table (title, slug, publish) and
   SiteSettings table (contact info, availability).
   ═══════════════════════════════════════════════════════════════ */
function SettingsTab({ onSave }: { onSave: () => void }) {
  const [siteData, setSiteData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/settings").then((r) => r.json()).then((d) => {
      setSiteData(d.site || {});
      setSettings(d.settings || {});
    });
  }, []);

  const save = async () => {
    setSaving(true); setMsg("");
    const res = await fetch("/api/dashboard/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteData: { title: siteData.title, slug: siteData.slug, langDefault: siteData.langDefault, isPublished: siteData.isPublished },
        settingsData: { email: settings.email, linkedin: settings.linkedin, github: settings.github, website: settings.website, cvUrl: settings.cvUrl, yearsExperience: settings.yearsExperience, projectsDelivered: settings.projectsDelivered, industriesServed: settings.industriesServed, availabilityStatus: settings.availabilityStatus },
      }),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved!" : "Error occurred");
    if (res.ok) onSave();
    setTimeout(() => setMsg(""), 3000);
  };

  if (!siteData) return <Loading />;

  /** Site data field renderer */
  const sf = (label: string, key: string, ph = "") => (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
      <input value={siteData[key] || ""} onChange={(e) => setSiteData({ ...siteData, [key]: e.target.value })} placeholder={ph}
        className="w-full px-3 py-2 rounded-xl bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] outline-none transition text-sm" />
    </div>
  );

  /** Settings data field renderer */
  const stf = (label: string, key: string, ph = "") => (
    <div>
      <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
      <input value={settings?.[key] || ""} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} placeholder={ph}
        className="w-full px-3 py-2 rounded-xl bg-white/50 border border-gray-200/60 focus:border-[--accent-rose] outline-none transition text-sm" />
    </div>
  );

  return (
    <>
      <Header title="Settings" extra={<SaveBtn saving={saving} onClick={save} />} />
      <Toast msg={msg} />
      <div className="space-y-4 mt-4">
        <Card title="Site">
          {sf("Title", "title")}
          {sf("Slug", "slug")}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Language</label>
            <select value={siteData.langDefault || "tr"} onChange={(e) => setSiteData({ ...siteData, langDefault: e.target.value })}
              className="px-3 py-2 rounded-xl bg-white/50 border border-gray-200/60 outline-none text-sm">
              <option value="tr">Türkçe</option><option value="en">English</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={siteData.isPublished ?? true} onChange={(e) => setSiteData({ ...siteData, isPublished: e.target.checked })} className="rounded" /> Publish
          </label>
        </Card>
        <Card title="Contact & Social">
          {stf("Email", "email", "you@example.com")}
          {stf("LinkedIn", "linkedin", "https://linkedin.com/in/")}
          {stf("GitHub", "github", "https://github.com/")}
          {stf("Website", "website", "https://")}
          {stf("CV URL", "cvUrl", "https://...")}
        </Card>
        <Card title="Metrics">
          {stf("Experience", "yearsExperience", "5+")}
          {stf("Projects", "projectsDelivered", "10+")}
          {stf("Industries", "industriesServed", "Fintech, Health")}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Availability</label>
            <select value={settings?.availabilityStatus || "open"} onChange={(e) => setSettings({ ...settings, availabilityStatus: e.target.value })}
              className="px-3 py-2 rounded-xl bg-white/50 border border-gray-200/60 outline-none text-sm">
              <option value="open">Available</option><option value="busy">Busy</option><option value="unavailable">Unavailable</option>
            </select>
          </div>
        </Card>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS TAB — Visitor statistics and charts.
   Displays total views, period views, unique visitors,
   daily views bar chart, top referrers, and top pages.
   ═══════════════════════════════════════════════════════════════ */
function AnalyticsTab() {
  const [data, setData] = useState<any>(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetch(`/api/dashboard/analytics?days=${days}`).then((r) => r.json()).then(setData);
  }, [days]);

  if (!data) return <Loading />;
  const maxViews = Math.max(...(data.dailyViews || []).map((d: any) => d.views), 1);

  return (
    <>
      <Header title="Analytics" extra={
        <div className="flex rounded-lg bg-white/40 border border-gray-200/60 p-0.5">
          {[7, 14, 30].map((d) => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${days === d ? "bg-[--accent-rose] text-white" : "text-gray-500"}`}>
              {d}d
            </button>
          ))}
        </div>
      } />

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { icon: Eye, label: "Views", value: data.totalViews },
          { icon: TrendingUp, label: `Last ${days}d`, value: data.periodViews },
          { icon: Users, label: "Unique", value: data.uniqueVisitors },
        ].map((m) => (
          <div key={m.label} className="glass rounded-xl p-3 border border-white/40">
            <m.icon size={14} className="text-[--accent-rose] mb-1.5" />
            <div className="text-xl font-bold">{m.value}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Daily views bar chart */}
      <Card title="Daily" className="mt-4">
        <div className="flex items-end gap-0.5 h-24">
          {(data.dailyViews || []).map((d: any, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full rounded-t bg-[--accent-rose] opacity-60"
                style={{ height: `${(d.views / maxViews) * 100}%`, minHeight: d.views > 0 ? 3 : 0 }} />
              <span className="text-[8px] text-gray-400">{new Date(d.date).getDate()}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Referrers and top pages */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <Card title="Referrers">
          {(data.referrers || []).length === 0 ? <p className="text-xs text-gray-400">No data</p> :
            (data.referrers || []).map((r: any, i: number) => (
              <div key={i} className="flex justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-600 truncate">{r.referrer || "Direct"}</span>
                <span className="font-medium">{r._count}</span>
              </div>
            ))}
        </Card>
        <Card title="Pages">
          {(data.topPages || []).length === 0 ? <p className="text-xs text-gray-400">No data</p> :
            (data.topPages || []).map((p: any, i: number) => (
              <div key={i} className="flex justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-600 truncate">{p.path}</span>
                <span className="font-medium">{p._count}</span>
              </div>
            ))}
        </Card>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED UI COMPONENTS — Reusable building blocks for the dashboard.
   ═══════════════════════════════════════════════════════════════ */

/** Section header with title and optional action buttons */
function Header({ title, extra }: { title: string; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="font-serif-accent text-xl font-bold">{title}</h1>
      <div className="flex items-center gap-2">{extra}</div>
    </div>
  );
}

/** Glassmorphism card container with title */
function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-xl p-4 border border-white/40 space-y-3 ${className}`}>
      <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

/** Save button with loading state */
function SaveBtn({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={saving}
      className="px-4 py-1.5 rounded-xl bg-black text-white text-xs font-medium hover:opacity-80 transition disabled:opacity-50 flex items-center gap-1.5">
      <Check size={13} /> {saving ? "..." : "Save"}
    </button>
  );
}

/** TR/EN language switcher toggle */
function LangSwitch({ lang, setLang }: { lang: "tr" | "en"; setLang: (l: "tr" | "en") => void }) {
  return (
    <div className="flex rounded-lg bg-white/40 border border-gray-200/60 p-0.5">
      {(["tr", "en"] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${lang === l ? "bg-[--accent-rose] text-white" : "text-gray-500"}`}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/** Toast notification — green for success, red for errors */
function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div className={`mt-3 text-xs rounded-xl px-3 py-2 ${msg === "Saved!" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
      {msg}
    </div>
  );
}

/** Loading spinner placeholder */
function Loading() {
  return <div className="text-sm text-gray-400 py-8 text-center">Loading...</div>;
}
