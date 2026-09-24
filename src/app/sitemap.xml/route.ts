import { fetchSitemapIndex } from "@/lib/api";
import { sitemapXml, sitemapUnavailable } from "@/lib/sitemap";
export async function GET() {
  try {
    const index = await fetchSitemapIndex();
    if (!index || !Number.isInteger(index.pages) || index.pages < 0 || index.pages > 49999) return sitemapUnavailable();
    return sitemapXml("sitemapindex", [{ path: "/sitemaps/pages.xml" }, ...Array.from({ length: index.pages }, (_, i) => ({ path: `/sitemaps/companies/${i + 1}.xml` }))]);
  } catch { return sitemapUnavailable(); }
}
