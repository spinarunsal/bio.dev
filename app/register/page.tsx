/**
 * Register Page — New user registration page (/register).
 *
 * Registration flow:
 * 1. User enters email, password, and a unique slug (username)
 * 2. Slug is checked in real-time with 500ms debounce (check-slug API)
 * 3. Form submit → /api/auth/register → User + Site + Content + Settings are created
 * 4. Auto-login (signIn) → redirected to /dashboard
 *
 * Slug rules: Only lowercase letters, digits, and hyphens. Min 3, max 30 characters.
 * Reserved slugs (admin, dashboard, etc.) are blocked in the check-slug API.
 */
"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slug, setSlug] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle"|"checking"|"available"|"taken">("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /** Real-time slug availability check with 500ms debounce */
  useEffect(() => {
    if (slug.length < 3) { setSlugStatus("idle"); return; }
    setSlugStatus("checking");
    const t = setTimeout(async () => {
      const res = await fetch(`/api/auth/check-slug?slug=${slug}`);
      const data = await res.json();
      setSlugStatus(data.available ? "available" : "taken");
    }, 500);
    return () => clearTimeout(t);
  }, [slug]);

  /** Handle registration form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugStatus !== "available") return;
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, slug }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "An error occurred"); setLoading(false); return; }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="noise" />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif-accent text-2xl font-bold">bio.dev</Link>
          <p className="mt-2 text-sm text-gray-500">Create your portfolio</p>
        </div>
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 border border-white/40 space-y-5">
          {error && <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</div>}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white/40 border border-white/50 focus:border-[--accent-rose] focus:ring-1 focus:ring-[--accent-rose] outline-none transition text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 rounded-xl bg-white/40 border border-white/50 focus:border-[--accent-rose] focus:ring-1 focus:ring-[--accent-rose] outline-none transition text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Page URL</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">bio.dev/</span>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} required minLength={3} placeholder="username"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/40 border border-white/50 focus:border-[--accent-rose] focus:ring-1 focus:ring-[--accent-rose] outline-none transition text-sm" />
              {slugStatus === "available" && <Check size={18} className="text-green-600" />}
              {slugStatus === "taken" && <X size={18} className="text-red-500" />}
            </div>
            {slugStatus === "taken" && <p className="text-xs text-red-500 mt-1">This URL is already taken</p>}
          </div>
          <button type="submit" disabled={loading || slugStatus !== "available"}
            className="w-full py-2.5 rounded-xl bg-black text-white font-medium hover:opacity-80 transition disabled:opacity-50 text-sm">
            {loading ? "Creating..." : "Create Portfolio"}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link href="/login" className="text-[--accent-rose] hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
