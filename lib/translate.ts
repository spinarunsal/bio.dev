/**
 * Translate Helper — Automatic translation from the dashboard.
 *
 * This module supports the TR/EN translation button in the dashboard.
 * The client sends requests to the /api/admin/translate endpoint.
 * The server side performs translations using the MyMemory API.
 * Requests are proxied through our own server to avoid CORS issues.
 *
 * Usage:
 *   const results = await translateFields(
 *     { title: "Merhaba", desc: "Açıklama" },
 *     "tr", "en"
 *   );
 *   // results = { title: "Hello", desc: "Description" }
 */
export async function translateFields(
    texts: Record<string, string>,
    from: "tr" | "en",
    to: "tr" | "en"
): Promise<Record<string, string>> {
    const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts, from, to }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Translation failed: ${err}`);
    }

    const data = await res.json();
    return data.results;
}
