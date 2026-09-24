import { fetchSitemapCompanies } from "@/lib/api";
import { companyPath } from "@/lib/company";
import { sitemapXml, sitemapUnavailable } from "@/lib/sitemap";
export async function GET(_request: Request, { params }: { params: Promise<{ shard: string }> }) {
  const { shard } = await params;
  if (!/^[1-9]\d{0,4}\.xml$/.test(shard)) return new Response(null, { status: 404 });
  try {
    const response = await fetchSitemapCompanies(Number(shard.slice(0, -4)));
    if (!response || response.data.length === 0) return new Response(null, { status: 404 });
    return sitemapXml("urlset", response.data.map(company => ({ path: companyPath(company), lastmod: company.last_update })));
  } catch { return sitemapUnavailable(); }
}
