import { SITE_URL } from "./company";
export function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
export function sitemapXml(kind: "sitemapindex" | "urlset", paths: { path: string; lastmod?: string | null }[]) {
  const tag = kind === "urlset" ? "url" : "sitemap";
  const content = paths.map(({ path, lastmod }) => {
    const date = lastmod && /^\d{4}-\d{2}-\d{2}/.test(lastmod) && !lastmod.startsWith("0000") ? lastmod.slice(0, 10) : null;
    return `<${tag}><loc>${xmlEscape(SITE_URL + path)}</loc>${date ? `<lastmod>${date}</lastmod>` : ""}</${tag}>`;
  }).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><${kind} xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${content}</${kind}>`, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store" } });
}
export function sitemapUnavailable() {
  return new Response("Sitemap temporariamente indisponível", { status: 503, headers: { "Retry-After": "300", "Cache-Control": "no-store" } });
}
