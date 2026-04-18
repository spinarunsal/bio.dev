/**
 * Profile Editor Page — Standalone profile editing page (/dashboard/profile).
 *
 * Provides a dedicated full-page profile editor with bilingual (TR/EN)
 * field editing. Fetches content from the API and saves changes on demand.
 * Sections: Hero, About, Skills, Identity Cards, Work & Contact.
 */
"use client";
import { useState, useEffect } from "react";

export default function ProfileEditor() {
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  /* Fetch content on mount */
  useEffect(() => { fetch("/api/dashboard/content").then(r => r.json()).then(d => setData(d.content || {})); }, []);

  /** Save content to the API */
  const save = async () => {
    setSaving(true); setMsg("");
    const res = await fetch("/api/dashboard/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    setMsg(res.ok ? "Saved!" : "Error occurred");
    setTimeout(() => setMsg(""), 3000);
  };

  if (!data) return <div className="text-gray-500">Loading...</div>;

  const isEn = lang === "en";
  /** Reusable field renderer — switches between TR/EN keys */
  const field = (label: string, key: string, keyEn: string, textarea = false) => {
    const k = isEn ? keyEn : key;
    const Tag = textarea ? "textarea" : "input";
    return (
      <div>
        <label className="text-sm font-medium text-gray-600 mb-1.5 block">{label}</label>
        <Tag value={data[k] || ""} onChange={(e: any) => setData({ ...data, [k]: e.target.value })}
          className={`w-full px-4 py-2.5 rounded-xl bg-white/40 border border-white/50 focus:border-[--accent-rose] focus:ring-1 focus:ring-[--accent-rose] outline-none transition text-sm ${textarea ? "min-h-[100px] resize-y" : ""}`} />
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif-accent text-2xl font-bold">Edit Profile</h1>
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div className="flex rounded-xl bg-white/30 border border-white/50 p-0.5">
            {(["tr", "en"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${lang === l ? "bg-[--accent-rose] text-white" : "text-gray-500 hover:text-gray-800"}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={save} disabled={saving}
            className="px-5 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-80 transition disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      {msg && <div className={`mb-4 text-sm rounded-xl px-4 py-2 ${msg === "Saved!" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>{msg}</div>}

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 border border-white/40 space-y-4">
          <h2 className="font-semibold text-lg">Hero Section</h2>
          {field("Title", "homeHeroTitle", "homeHeroTitleEn")}
          {field("Subtitle", "homeHeroSubtitle", "homeHeroSubtitleEn")}
          {field("Typing Lines (JSON)", "typingLinesJson", "typingLinesJsonEn", true)}
        </div>
        <div className="glass rounded-2xl p-6 border border-white/40 space-y-4">
          <h2 className="font-semibold text-lg">About</h2>
          {field("About (Markdown)", "aboutMarkdown", "aboutMarkdownEn", true)}
        </div>
        <div className="glass rounded-2xl p-6 border border-white/40 space-y-4">
          <h2 className="font-semibold text-lg">Skills</h2>
          {field("Skills (JSON)", "skillsJson", "skillsJsonEn", true)}
        </div>
        <div className="glass rounded-2xl p-6 border border-white/40 space-y-4">
          <h2 className="font-semibold text-lg">Identity Cards</h2>
          {field("Music Title", "musicTitle", "musicTitleEn")}
          {field("Music Content", "musicContent", "musicContentEn", true)}
          {field("Animal Title", "animalTitle", "animalTitleEn")}
          {field("Animal Content", "animalContent", "animalContentEn", true)}
        </div>
        <div className="glass rounded-2xl p-6 border border-white/40 space-y-4">
          <h2 className="font-semibold text-lg">Work & Contact</h2>
          {field("Work Intro (Markdown)", "workIntroMarkdown", "workIntroMarkdownEn", true)}
          {field("Contact (Markdown)", "contactMarkdown", "contactMarkdownEn", true)}
          {field("Featured Description", "featuredDescription", "featuredDescriptionEn", true)}
        </div>
      </div>
    </div>
  );
}
