import { cache } from "react";

export type CnpjCompany = {
  id: number;
  url?: string;
  name: string;
  fantasy?: string | null;
  cnpj: string;
  city?: string | null;
  state?: string | null;
  activities?: { code?: string; name?: string } | unknown;
  situation?: string | null;
  opening?: string | null;
  last_update?: string | null;
  street?: string | null;
  number?: string | number | null;
  complement?: string | null;
  neighborhood?: string | null;
  zip_code?: string | null;
  phone?: string | null;
  email?: string | null;
  legal_nature?: { cod?: string; name?: string } | string | null;
  secondary_activities?: { activities?: { code?: string; name?: string } | null }[];
  activity?: { code?: string; name?: string } | null;
};

export type Empresa = {
  url: string;
  name: string;
  slogan?: string | null;
  description?: string | null;
  category_name?: string | null;
  phone?: string | null;
  whatsapp_url?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  status?: string | null;
};

export type CnpjCity = {
  id: number;
  name: string;
  state: string;
  url?: string | null;
  companies_count?: number;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: { current_page: number; per_page: number; total?: number; last_page?: number; has_more_pages?: boolean };
};

const apiUrl = process.env.API_URL ?? "http://localhost:8000/api";

async function getJson<T>(path: string): Promise<T | null> {
  const response = await fetch(`${apiUrl}${path}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (response.status === 404 || response.status === 410) return null;
  if (!response.ok) throw new Error(`CNPJ API unavailable (${response.status})`);
  return response.json() as Promise<T>;
}

export async function fetchCnpjCompanies(params: Record<string, string | number> = {}) {
  const query = new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]));
  return getJson<PaginatedResponse<CnpjCompany>>(`/cnpj/companies?${query}`);
}

export async function fetchCnpjBestCities() {
  return getJson<{ data: CnpjCity[] }>("/cnpj/best-cities");
}

export async function fetchCnpjCities() {
  return getJson<{ data: CnpjCity[] }>("/cnpj/cities");
}

export async function fetchCnpjCity(citySlug: string, after?: number) {
  const query = after ? `?after=${after}` : "";
  return getJson<{ city: CnpjCity; data: CnpjCompany[]; meta: { next_after?: number; has_more_pages: boolean } }>(`/cnpj/cities/${encodeURIComponent(citySlug)}${query}`);
}

export const fetchCnpjCompany = cache(async (cnpj: string) => {
  return getJson<{ data: CnpjCompany; related?: CnpjCompany[] }>(`/cnpj/companies/${encodeURIComponent(cnpj)}`);
});

export async function fetchSitemapIndex() {
  return getJson<{ pages: number }>("/cnpj/sitemaps");
}
export async function fetchSitemapCompanies(page: number) {
  return getJson<{ data: CnpjCompany[] }>(`/cnpj/sitemaps/${page}`);
}
