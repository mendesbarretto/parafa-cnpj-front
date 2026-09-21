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

async function getJson<T>(path: string, timeoutMs = 2500, noStore = false): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${apiUrl}${path}`, noStore
      ? { cache: "no-store", signal: controller.signal }
      : { next: { revalidate: 300 }, signal: controller.signal });
    if (!response.ok) return null;
    return response.json() as Promise<T>;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
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
  return getJson<{ city: CnpjCity; data: CnpjCompany[]; meta: { next_after?: number; has_more_pages: boolean } }>(`/cnpj/cities/${encodeURIComponent(citySlug)}${query}`, 5000);
}

export async function fetchCnpjCompany(cnpj: string) {
  return getJson<{ data: CnpjCompany; related?: CnpjCompany[] }>(`/cnpj/companies/${encodeURIComponent(cnpj)}`, 10000, true);
}