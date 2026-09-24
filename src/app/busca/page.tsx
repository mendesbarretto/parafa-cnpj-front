import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { CnpjCard } from "@/components/CnpjCard";
import { CnpjSearchForm } from "@/components/CnpjSearchForm";
import { AdSlot } from "@/components/AdSlot";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchCnpjCompanies } from "@/lib/api";

type SearchPageProps = { searchParams: Promise<{ search?: string; busca?: string; page?: string }> };

export const metadata: Metadata = { title: "Buscar empresas | Parafa CNPJ", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  if (params.busca && !params.search) {
    const query = new URLSearchParams({ search: params.busca });
    if (params.page) query.set("page", params.page);
    permanentRedirect(`/busca?${query}`);
  }
  const search = params.search?.trim() ?? "";
  const page = Number(params.page ?? 1);
  const response = search.length > 0 && search.length < 3 ? null : await fetchCnpjCompanies({ ...(search ? { search } : {}), page: Number.isFinite(page) && page > 0 ? page : 1 });
  const companies = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Consulta pública</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">Buscar empresas</h1>
        <div className="mt-7"><CnpjSearchForm defaultValue={search} /></div>
        <div className="mt-8"><AdSlot slotId="2668303352" /></div>
        <p className="mt-8 text-sm text-muted-foreground">{search ? `Resultados para “${search}”` : "Digite um CNPJ ou nome para começar"}{meta?.total !== undefined ? ` • ${meta.total.toLocaleString("pt-BR")} encontrados` : ""}</p>
        <section className="mt-3 max-w-3xl rounded-2xl border bg-card px-5 shadow-[var(--shadow-soft)]">
          {companies.length ? companies.map((company) => <CnpjCard key={company.id} company={company} />) : <p className="py-10 text-muted-foreground">{search.length > 0 && search.length < 3 ? "Digite pelo menos 3 caracteres para buscar." : "Nenhuma empresa encontrada."}</p>}
        </section>
        {meta && (meta.current_page > 1 || meta.has_more_pages) && <nav className="mt-6 flex gap-3 text-sm font-semibold">
          {meta.current_page > 1 && <a className="rounded-lg border border-input bg-card px-4 py-2 hover:border-primary" href={`/busca?search=${encodeURIComponent(search)}&page=${meta.current_page - 1}`}>Anterior</a>}
          {meta.has_more_pages && <a className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary-deep" href={`/busca?search=${encodeURIComponent(search)}&page=${meta.current_page + 1}`}>Próxima</a>}
        </nav>}
      </main>
      <SiteFooter />
    </div>
  );
}