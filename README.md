# bio.dev — Multi-Tenant Portfolio Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6)](https://typescriptlang.org)

> 🚀 A fullstack, multi-tenant personal portfolio builder. Users register, pick a
> unique slug, and instantly get a polished public portfolio page at
> `yourdomain.com/<slug>`. All content is managed from a single-page dashboard with
> live preview.

**By PinLab** — Premium Mobile & Web Templates

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and AUTH_SECRET

# 3. Set up database
npx prisma db push

# 4. (Optional) Seed sample data
node scripts/seed.js
# Test user: test@bio.dev / test123 → http://localhost:3000/test

# 5. Start development server
npm run dev
# → http://localhost:3000
```

---

## Features

- **Multi-tenant** — Each user gets `yourdomain.com/username`
- **Single-page dashboard** — Split-panel editor with live preview
- **Case study projects** — Problem → Solution → Results format
- **Bilingual** — TR / EN support with language toggle
- **Visitor analytics** — Cookie-free tracking (no GDPR banner needed)
- **Auto-save** — 800ms debounce on profile editing
- **Glassmorphism UI** — Frosted glass design with smooth animations
- **SSR** — Server-side rendered public pages for SEO
- **Secure** — NextAuth.js, bcrypt, JWT sessions, security headers

---

## Tech Stack

| Layer     | Technology                                 |
|-----------|--------------------------------------------|
| Framework | Next.js 16 (App Router)                    |
| Language  | TypeScript 5+                              |
| Database  | PostgreSQL (prod) / SQLite (dev)           |
| ORM       | Prisma 6                                   |
| Auth      | NextAuth.js v5 — Credentials               |
| Styling   | Tailwind CSS 4 + Custom Glassmorphism      |
| Animation | Framer Motion 12                            |

---

## Documentation

See the `documentation/` folder for the full setup guide, customization options, and deployment instructions.

---

## Deployment (Vercel)

1. Push your code to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Set `DATABASE_URL` (PostgreSQL) and `AUTH_SECRET`
4. Deploy — build command is pre-configured

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use this project for personal or commercial purposes.

---

## Author

**PinLab** — Premium Mobile & Web Templates

Premium Flutter & Next.js Templates
