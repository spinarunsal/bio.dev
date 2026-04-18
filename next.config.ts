/**
 * Next.js Configuration — Application settings.
 *
 * Security headers:
 * - X-Frame-Options: Prevents clickjacking attacks
 * - X-Content-Type-Options: Blocks MIME sniffing
 * - Referrer-Policy: Controls referrer information
 * - Permissions-Policy: Disables camera, microphone, and geolocation APIs
 * - poweredByHeader: false → Hides the "X-Powered-By: Next.js" header
 *
 * Image optimization: Supports AVIF and WebP formats.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
