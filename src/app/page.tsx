import { CnpjCard } from "@/components/CnpjCard";
import { CnpjSearchForm } from "@/components/CnpjSearchForm";
import { AdSlot } from "@/components/AdSlot";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchCnpjBestCities, fetchCnpjCompanies } from "@/lib/api";
import Link from "next/link";

export default async function Home() {
  const [companiesResponse, citiesResponse] = await Promise.all([
    fetchCnpjCompanies({ per_page: 10 }),
    fetchCnpjBestCities(),
  ]);
  const companies = companiesResponse?.data ?? [];
  const cities = citiesResponse?.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="bg-primary-deep px-5 py-20 text-primary-foreground sm:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">Parafa CNPJ</p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Encontre empresas de todo o Brasil</h1>
            <p className="mt-5 max-w-xl text-lg text-primary-foreground/75">Consulte dados públicos de empresas, atividades e localização em poucos segundos.</p>
            <div className="mt-8"><CnpjSearchForm /></div>
            <div className="mt-8"><AdSlot slotId="8686916795" /></div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Atualizações</p><h2 className="mt-1 text-2xl font-bold">Empresas recentes</h2></div>
              <Link className="text-sm font-semibold text-primary hover:underline" href="/busca">Ver todas</Link>
            </div>
            <div className="rounded-2xl border bg-card px-5 shadow-[var(--shadow-soft)]">
              {companies.length ? companies.map((company) => <CnpjCard key={company.id} company={company} />) : <p className="py-8 text-muted-foreground">A API ainda não está disponível ou não retornou empresas.</p>}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Explore por localização</p>
            <h2 className="mt-1 text-2xl font-bold">Cidades para explorar</h2>
            <div className="mt-4 divide-y divide-border rounded-2xl border bg-card px-5 shadow-[var(--shadow-soft)]">
              {cities.length ? cities.map((city, index) => <a key={city.id} href={`/${city.url ? `${city.url}-${city.state.toLowerCase()}` : `${city.name.toLowerCase()}-${city.state.toLowerCase()}`}`} className="flex items-center py-4 hover:text-primary"><span><span className="mr-3 text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>{city.name}/{city.state}</span></a>) : <p className="py-8 text-muted-foreground">As cidades aparecerão quando a conexão CNPJ estiver configurada.</p>}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
