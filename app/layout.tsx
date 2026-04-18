/**
 * Root Layout — Main application layout.
 *
 * This file defines the shared HTML structure for all pages:
 * - Google Fonts (Inter + Space Grotesk) are loaded
 * - SEO metadata is configured (title, description, OpenGraph, Twitter Card)
 * - NextAuth SessionProvider enables session management
 *
 * In Next.js App Router, `layout.tsx` files act as wrappers for child pages.
 * Changes in this file are reflected across ALL pages.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
 */
import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

const SITE_URL = "https://bio.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "bio.dev — Professional Portfolio Platform",
    template: "%s | bio.dev",
  },
  description:
    "Create your personal portfolio page in minutes with bio.dev. Showcase your projects, highlight your career.",
  keywords: [
    "portfolio",
    "bio",
    "personal page",
    "portfolio builder",
    "developer portfolio",
    "personal page builder",
    "bio.dev",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "tr_TR",
    url: SITE_URL,
    siteName: "bio.dev",
    title: "bio.dev — Professional Portfolio Platform",
    description:
      "Create your personal portfolio page in minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "bio.dev — Professional Portfolio Platform",
    description:
      "Create your personal portfolio page in minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
