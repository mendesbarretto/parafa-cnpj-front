import { SiteHeader } from "@/components/SiteHeader";
import { fetchCnpjCities } from "@/lib/api";

export default async function CitiesPage() {
  const response = await fetchCnpjCities();
  const cities = response?.data ?? [];
  const states = cities.reduce<Record<string, typeof cities>>((groups, city) => {
    (groups[city.state] ??= []).push(city);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Diretório CNPJ</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">Cidades</h1>
        <p className="mt-3 text-muted-foreground">Explore empresas por município e estado.</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(states).map(([state, stateCities]) => <section key={state}><h2 className="border-b border-border pb-2 text-xl font-bold text-foreground">{state}</h2><div className="divide-y divide-border">{stateCities.map((city) => <a key={city.id} href={`/${city.url ? `${city.url}-${state.toLowerCase()}` : `${city.name.toLowerCase()}-${state.toLowerCase()}`}`} className="block py-3 text-sm hover:text-primary">{city.name}</a>)}</div></section>)}
        </div>
        {!cities.length && <p className="mt-10 rounded-xl border bg-card p-6 text-muted-foreground shadow-[var(--shadow-soft)]">As cidades aparecerão quando a conexão CNPJ estiver configurada.</p>}
      </main>
    </div>
  );
}
