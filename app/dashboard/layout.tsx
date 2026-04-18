/**
 * Dashboard Layout — Wrapper layout for the dashboard page.
 *
 * SessionProvider enables all components under /dashboard
 * to access session information via the useSession() hook.
 * A SessionProvider also exists in the root layout, but a nested
 * provider is required for client components.
 */
"use client";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
