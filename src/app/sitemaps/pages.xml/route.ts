import { fetchCnpjCities } from "@/lib/api";
import { cityPath } from "@/lib/company";
import { sitemapXml, sitemapUnavailable } from "@/lib/sitemap";
export async function GET() {
  try {
    const cities = await fetchCnpjCities();
    if (!cities) return sitemapUnavailable();
    return sitemapXml("urlset", [{ path: "/" }, { path: "/cidades" }, { path: "/politica-de-privacidade" }, ...cities.data.map(city => ({ path: cityPath(city) }))]);
  } catch { return sitemapUnavailable(); }
}
