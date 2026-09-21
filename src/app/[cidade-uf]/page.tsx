import Link from "next/link";
import { notFound } from "next/navigation";
import { CnpjCard } from "@/components/CnpjCard";
import { CnpjSearchForm } from "@/components/CnpjSearchForm";
import { AdSlot } from "@/components/AdSlot";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchCnpjCity } from "@/lib/api";

type CityPageProps = { params: Promise<{ "cidade-uf": string }>; searchParams: Promise<{ after?: string }> };

export async function generateMetadata({ params }: CityPageProps) {
  const { "cidade-uf": slug } = await params;
  const response = await fetchCnpjCity(slug);
  return { title: response ? `${response.city.name}/${response.city.state} | Parafa CNPJ` : "Cidade não encontrada | Parafa CNPJ" };
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const { "cidade-uf": slug } = await params;
  const { after } = await searchParams;
  const cursor = after ? Number(after) : undefined;
  const response = await fetchCnpjCity(slug, Number.isFinite(cursor) ? cursor : undefined);
  if (!response) notFound();

  const { city, data: companies, meta } = response;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <nav className="text-sm text-muted-foreground"><Link href="/cidades" className="hover:text-primary">Cidades</Link><span className="px-2">/</span>{city.name}/{city.state}</nav>
        <header className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Empresas por cidade</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Empresas em {city.name}/{city.state}</h1>
          <p className="mt-3 text-muted-foreground">Consulte empresas, CNPJ e atividades cadastradas neste município.</p>
          <div className="mt-7"><CnpjSearchForm /></div>
        </header>

        <div className="mt-8"><AdSlot slotId="2668303352" /></div>

        <section className="mt-10 max-w-3xl rounded-2xl border bg-card px-5 shadow-[var(--shadow-soft)]">
          {companies.length ? companies.map((company) => <CnpjCard key={company.id} company={company} />) : <p className="py-10 text-muted-foreground">Nenhuma empresa encontrada nesta cidade.</p>}
        </section>
        {meta.has_more_pages && meta.next_after && <div className="mt-6"><Link className="inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary-deep" href={`/${slug}?after=${meta.next_after}`}>Carregar mais empresas</Link></div>}
      </main>
      <SiteFooter />
    </div>
  );
}