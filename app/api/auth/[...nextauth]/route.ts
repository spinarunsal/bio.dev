/**
 * NextAuth Catch-All Route — /api/auth/[...nextauth]
 *
 * GET and POST handlers required for NextAuth.js session management.
 * All auth requests (signin, signout, session, csrf) go through this route.
 * Configuration is defined in lib/auth.ts.
 */
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
