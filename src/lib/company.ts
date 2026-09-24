import type { CnpjCompany } from "./api";

export const SITE_URL = "https://cnpj.parafa.com.br";

export function publicName(value: string) {
  return value.replace(/(?:^|\s+)\d{3}\.?\d{3}\.?\d{3}-?\d{2}\s*$/, "").trim() || "Empresa";
}

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function cityPath(city: { name: string; state: string; url?: string | null }) {
  return `/${city.url || slugify(city.name)}-${city.state.toLowerCase()}`;
}

export function companyPath(company: CnpjCompany) {
  if (company.url) {
    try {
      const url = new URL(company.url, SITE_URL);
      const parts = url.pathname.split("/").filter(Boolean);
      if (url.origin === SITE_URL && parts.length >= 3 && parts[1] === company.cnpj && !url.pathname.includes("%")) {
        return url.pathname.replace(/\/$/, "");
      }
    } catch { /* Build a local URL from the public fields. */ }
  }
  return `${cityPath({ name: company.city || "brasil", state: company.state || "br" })}/${company.cnpj}/${slugify(publicName(company.name))}`;
}

export function formatCnpj(value: string) {
  const cnpj = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return cnpj.length === 14 ? `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}` : value;
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
