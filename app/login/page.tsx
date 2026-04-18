/**
 * Login Page — User login page (/login).
 *
 * Logs in with email + password via the NextAuth Credentials provider.
 * On successful login, redirects to /dashboard.
 * On error, displays a red error message inside the form.
 *
 * signIn("credentials", { ... }) → NextAuth's client-side login function.
 * redirect: false is used to programmatically handle the result.
 */
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /** Handle form submission — authenticate via NextAuth Credentials provider */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Invalid email or password"); return; }
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="noise" />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif-accent text-2xl font-bold">bio.dev</Link>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
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
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-white/40 border border-white/50 focus:border-[--accent-rose] focus:ring-1 focus:ring-[--accent-rose] outline-none transition text-sm" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-xl bg-black text-white font-medium hover:opacity-80 transition disabled:opacity-50 text-sm">
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account? <Link href="/register" className="text-[--accent-rose] hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
