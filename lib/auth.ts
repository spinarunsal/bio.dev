/**
 * NextAuth Configuration — Authentication system.
 *
 * This file contains NextAuth.js v5 (Auth.js) settings:
 * - Credentials provider: Login with email + password (bcrypt hash comparison)
 * - JWT strategy: Session info is stored as a JWT token in a cookie
 * - Callbacks: userId, siteId, siteSlug are added to the token → accessible from session
 *
 * Usage:
 *   import { auth } from "@/lib/auth";
 *   const session = await auth(); // In Server Components
 *
 * Exported functions:
 * - handlers: NextAuth API route handlers (/api/auth/[...nextauth])
 * - signIn / signOut: Programmatic login/logout
 * - auth: Server-side session reading
 *
 * @see https://authjs.dev/getting-started
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      siteId: string;
      siteSlug: string;
    };
  }

  interface User {
    siteId?: string;
    siteSlug?: string;
  }
}

declare module "next-auth" {
  interface JWT {
    userId: string;
    siteId: string;
    siteSlug: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { sites: { take: 1 } },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        const site = user.sites[0];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          siteId: site?.id || "",
          siteSlug: site?.slug || "",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id!;
        token.siteId = (user as any).siteId || "";
        token.siteSlug = (user as any).siteSlug || "";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.siteId = token.siteId as string;
      session.user.siteSlug = token.siteSlug as string;
      return session;
    },
  },
});
