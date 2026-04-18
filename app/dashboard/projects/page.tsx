/**
 * Projects Manager Page — Standalone project management page (/dashboard/projects).
 *
 * Full CRUD interface for managing portfolio projects.
 * Supports bilingual editing (TR/EN), case study fields
 * (problem, solution, results), and status toggles (featured, published).
 */
"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Project = any;
const empty: Project = { slug: "", title: "", titleEn: "", role: "", roleEn: "", summary: "", summaryEn: "", stack: "[]", problem: "", problemEn: "", solution: "[]", solutionEn: "[]", results: "[]", resultsEn: "[]", cover: "", isFeatured: false, isPublished: true };

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  /** Fetch all projects from the API */
  const load = useCallback(() => { fetch("/api/dashboard/projects").then(r => r.json()).then(d => setProjects(d.projects || [])); }, []);
  useEffect(() => { load(); }, [load]);

  /** Save project (create or update) */
  const save = async () => {
    setSaving(true);
    const url = isNew ? "/api/dashboard/projects" : `/api/dashboard/projects/${editing!.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    setSaving(false);
    if (res.ok) { setEditing(null); setIsNew(false); load(); setMsg("Saved!"); setTimeout(() => setMsg(""), 3000); }
  };

  /** Delete project with confirmation */
  const del = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await fetch(`/api/dashboard/projects/${id}`, { method: "DELETE" });
    load();
  };

  const isEn = lang === "en";
  /** Bilingual field renderer */
  const field = (label: string, key: string, keyEn: string, textarea = false) => {
    if (!editing) return null;
    const k = isEn ? keyEn : key;
    const Tag = textarea ? "textarea" : "input";
    return (
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
        <Tag value={editing[k] || ""} onChange={(e: any) => setEditing({ ...editing, [k]: e.target.value })}
          className={`w-full px-3 py-2 rounded-xl bg-white/40 border border-white/50 focus:border-[--accent-rose] outline-none transition text-sm ${textarea ? "min-h-[80px] resize-y" : ""}`} />
      </div>
    );
  };

  /* Project editing form */
  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif-accent text-2xl font-bold">{isNew ? "New Project" : "Edit Project"}</h1>
          <div className="flex items-center gap-3">
            <div className="flex rounded-xl bg-white/30 border border-white/50 p-0.5">
              {(["tr", "en"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${lang === l ? "bg-[--accent-rose] text-white" : "text-gray-500"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={() => { setEditing(null); setIsNew(false); }}
              className="p-2 rounded-xl hover:bg-white/30 text-gray-500 transition"><X size={18} /></button>
            <button onClick={save} disabled={saving}
              className="px-5 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-80 transition disabled:opacity-50 flex items-center gap-2">
              <Check size={15} /> {saving ? "..." : "Save"}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass rounded-2xl p-5 border border-white/40 space-y-3">
            <h3 className="font-semibold text-sm">Basic Info</h3>
            {isNew && (
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Slug</label>
                <input value={editing.slug || ""} onChange={(e: any) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  className="w-full px-3 py-2 rounded-xl bg-white/40 border border-white/50 outline-none text-sm" />
              </div>
            )}
            {field("Title", "title", "titleEn")}
            {field("Role", "role", "roleEn")}
            {field("Summary", "summary", "summaryEn", true)}
            {field("Cover Image URL", "cover", "cover")}
            {field("Tech Stack (JSON)", "stack", "stack", true)}
          </div>
          <div className="glass rounded-2xl p-5 border border-white/40 space-y-3">
            <h3 className="font-semibold text-sm">Case Study</h3>
            {field("Problem", "problem", "problemEn", true)}
            {field("Solution (JSON array)", "solution", "solutionEn", true)}
            {field("Results (JSON array)", "results", "resultsEn", true)}
          </div>
          <div className="glass rounded-2xl p-5 border border-white/40 flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.isFeatured} onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })} className="rounded" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.isPublished} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} className="rounded" />
              Published
            </label>
          </div>
        </div>
      </div>
    );
  }

  /* Project listing view */
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif-accent text-2xl font-bold">Projects</h1>
        <button onClick={() => { setEditing({ ...empty }); setIsNew(true); }}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-80 transition flex items-center gap-2">
          <Plus size={15} /> New Project
        </button>
      </div>
      {msg && <div className="mb-4 text-sm text-green-600 bg-green-50 rounded-xl px-4 py-2">{msg}</div>}
      <div className="space-y-3">
        {projects.map((p: any) => (
          <div key={p.id} className="glass rounded-2xl p-5 border border-white/40 flex items-center justify-between group">
            <div>
              <div className="font-medium text-sm">{p.title}</div>
              <div className="text-xs text-gray-500 mt-1">{p.role} · {p.slug}</div>
              <div className="flex gap-2 mt-2">
                {p.isFeatured && <span className="px-2 py-0.5 rounded-lg text-[10px] bg-[--accent-rose-light] text-[--accent-rose]">Featured</span>}
                {p.isPublished ? <span className="px-2 py-0.5 rounded-lg text-[10px] bg-green-50 text-green-600">Published</span> : <span className="px-2 py-0.5 rounded-lg text-[10px] bg-gray-100 text-gray-500">Draft</span>}
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => { setEditing(p); setIsNew(false); }} className="p-2 rounded-xl hover:bg-white/40 text-gray-500 transition"><Pencil size={15} /></button>
              <button onClick={() => del(p.id)} className="p-2 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600 transition"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <div className="text-sm text-gray-400 text-center py-8">No projects yet. Add a new project.</div>}
      </div>
    </div>
  );
}
