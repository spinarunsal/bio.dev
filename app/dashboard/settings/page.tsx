/**
 * Settings Page — Standalone site settings page (/dashboard/settings).
 *
 * Manages site configuration (title, slug, language, publish status),
 * social/contact links (email, LinkedIn, GitHub, website, CV),
 * and professional metrics (experience, projects, industries, availability).
 */
"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [siteData, setSiteData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/settings").then(r => r.json()).then(d => {
      setSiteData(d.site || {});
      setSettings(d.settings || {});
    });
  }, []);

  /** Save both site data and settings */
  const save = async () => {
    setSaving(true); setMsg("");
    const res = await fetch("/api/dashboard/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteData: {
          title: siteData.title,
          slug: siteData.slug,
          langDefault: siteData.langDefault,
          isPublished: siteData.isPublished,
        },
        settingsData: {
          email: settings.email,
          linkedin: settings.linkedin,
          github: settings.github,
          website: settings.website,
          cvUrl: settings.cvUrl,
          yearsExperience: settings.yearsExperience,
          projectsDelivered: settings.projectsDelivered,
          industriesServed: settings.industriesServed,
          availabilityStatus: settings.availabilityStatus,
        },
      }),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved!" : "Error occurred");
    setTimeout(() => setMsg(""), 3000);
  };

  if (!siteData) return <div className="text-gray-500">Loading...</div>;

  /** Site field renderer */
  const siteField = (label: string, key: string, placeholder = "") => (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1.5 block">{label}</label>
      <input value={siteData[key] || ""} onChange={(e) => setSiteData({ ...siteData, [key]: e.target.value })} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-white/40 border border-white/50 focus:border-[--accent-rose] outline-none transition text-sm" />
    </div>
  );

  /** Settings field renderer */
  const settingsField = (label: string, key: string, placeholder = "") => (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1.5 block">{label}</label>
      <input value={settings?.[key] || ""} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-white/40 border border-white/50 focus:border-[--accent-rose] outline-none transition text-sm" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif-accent text-2xl font-bold">Site Settings</h1>
        <button onClick={save} disabled={saving}
          className="px-5 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-80 transition disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {msg && <div className={`mb-4 text-sm rounded-xl px-4 py-2 ${msg === "Saved!" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>{msg}</div>}

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 border border-white/40 space-y-4">
          <h2 className="font-semibold text-lg">Site Configuration</h2>
          {siteField("Site Title", "title", "Portfolio Title")}
          {siteField("Slug", "slug", "username")}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Default Language</label>
            <select value={siteData.langDefault || "tr"} onChange={(e) => setSiteData({ ...siteData, langDefault: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-white/40 border border-white/50 outline-none text-sm">
              <option value="tr">Türkçe</option><option value="en">English</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={siteData.isPublished ?? true} onChange={(e) => setSiteData({ ...siteData, isPublished: e.target.checked })} className="rounded" />
            Publish site
          </label>
        </div>
        <div className="glass rounded-2xl p-6 border border-white/40 space-y-4">
          <h2 className="font-semibold text-lg">Contact & Social Media</h2>
          {settingsField("Email", "email", "you@example.com")}
          {settingsField("LinkedIn", "linkedin", "https://linkedin.com/in/")}
          {settingsField("GitHub", "github", "https://github.com/")}
          {settingsField("Website", "website", "https://")}
          {settingsField("CV URL", "cvUrl", "https://...")}
        </div>
        <div className="glass rounded-2xl p-6 border border-white/40 space-y-4">
          <h2 className="font-semibold text-lg">Metrics</h2>
          {settingsField("Experience", "yearsExperience", "5+")}
          {settingsField("Completed Projects", "projectsDelivered", "10+")}
          {settingsField("Industries", "industriesServed", "Fintech, Health")}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">Availability</label>
            <select value={settings?.availabilityStatus || "open"} onChange={(e) => setSettings({ ...settings, availabilityStatus: e.target.value })}
              className="px-4 py-2.5 rounded-xl bg-white/40 border border-white/50 outline-none text-sm">
              <option value="open">Available</option><option value="busy">Busy</option><option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
