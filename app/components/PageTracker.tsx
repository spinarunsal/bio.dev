/**
 * PageTracker — Anonymous visitor tracking component.
 *
 * Embedded in publicly accessible portfolio pages.
 * On every page change, sends a POST request to the /api/track endpoint:
 * - path: The visited page path
 * - referrer: Where the visitor came from
 * - screenResolution: Screen resolution
 * - language: Browser language
 * - siteSlug: Which user's page is being visited
 *
 * Internal paths like dashboard and login are not tracked.
 * Does not use cookies → no GDPR banner required.
 */
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Page tracker component for public portfolio pages.
 * Extracts the site slug from the URL path and sends tracking data.
 */
export default function PageTracker({ siteSlug }: { siteSlug?: string }) {
    const pathname = usePathname();

    useEffect(() => {
        // Extract slug from pathname if not provided
        const slug = siteSlug || pathname.split("/")[1] || "";

        // Skip tracking for non-site paths
        if (!slug || ["dashboard", "login", "register", "admin", "api"].includes(slug)) {
            return;
        }

        const data = {
            path: pathname,
            referrer: document.referrer,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            siteSlug: slug,
        };

        fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).catch(() => { });
    }, [pathname, siteSlug]);

    return null;
}
