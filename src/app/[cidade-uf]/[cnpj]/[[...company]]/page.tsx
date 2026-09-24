import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { CnpjCard } from "@/components/CnpjCard";
import { AdSlot } from "@/components/AdSlot";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CnpjRequestForm } from "@/components/CnpjRequestForm";
import { SITE_URL, companyPath, publicName, formatCnpj, jsonLd } from "@/lib/company";
import { fetchCnpjCity, fetchCnpjCompany } from "@/lib/api";

type CompanyPageProps = {
  params: Promise<{ "cidade-uf": string; cnpj: string; company?: string[] }>;
};

function formatDate(value?: string | null) {
  if (!value) return "Não informado";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export async function generateMetadata({ params }: CompanyPageProps) {
  const { cnpj } = await params;
  const response = await fetchCnpjCompany(cnpj);
  const company = response?.data;

  if (!company) notFound();
  const title = `${publicName(company.name)} — CNPJ ${formatCnpj(company.cnpj)} | ${company.city}/${company.state}`;
  const description = `Consulte situação cadastral, atividade e informações de ${publicName(company.name)}, CNPJ ${formatCnpj(company.cnpj)}, em ${company.city}/${company.state}.`;
  return {
    alternates: { canonical: companyPath(company) },
    openGraph: { title, description, url: companyPath(company), type: "website", locale: "pt_BR", siteName: "Parafa CNPJ" },
    title,
    description,
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { cnpj, "cidade-uf": citySlug, company: suffix } = await params;
  const response = await fetchCnpjCompany(cnpj);
  const company = response?.data;

  if (!company) notFound();
  const canonical = companyPath(company);
  const requestedPath = `/${citySlug}/${cnpj}${suffix?.length ? `/${suffix.join("/")}` : ""}`;
  if (requestedPath !== canonical) permanentRedirect(canonical);

  let relatedCompanies = Array.isArray(response?.related) ? response.related : [];
  if (relatedCompanies.length === 0) {
    const cityResponse = await fetchCnpjCity(citySlug);
    relatedCompanies = Array.isArray(cityResponse?.data)
      ? cityResponse.data.filter((item) => item.cnpj !== company.cnpj)
      : [];
  }

  const legalNature = typeof company.legal_nature === "string" ? company.legal_nature : company.legal_nature?.name;
  const activity = company.activity ?? (Array.isArray(company.activities) ? company.activities[0] : typeof company.activities === "object" && company.activities !== null ? company.activities as { code?: string; name?: string } : null);
  const address = [company.street, company.number, company.complement].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([
          { "@context": "https://schema.org", "@type": "Organization", name: publicName(company.name), identifier: company.cnpj, url: SITE_URL + canonical, address: { "@type": "PostalAddress", addressLocality: company.city, addressRegion: company.state, addressCountry: "BR" } },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Cidades", item: `${SITE_URL}/cidades` },
            { "@type": "ListItem", position: 2, name: `${company.city}/${company.state}`, item: `${SITE_URL}/${citySlug}` },
            { "@type": "ListItem", position: 3, name: publicName(company.name), item: SITE_URL + canonical },
          ] },
        ]) }} />
        <nav className="text-sm text-muted-foreground"><Link href={`/${citySlug}`} className="hover:text-primary">{company.city}/{company.state}</Link> <span className="px-2">/</span> Empresa</nav>

        <header className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Cadastro nacional</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{publicName(company.name)}</h1>
          {company.fantasy && <p className="mt-2 text-lg text-muted-foreground">{company.fantasy}</p>}
          <p className="mt-4 text-base text-muted-foreground">CNPJ: {formatCnpj(company.cnpj)}</p>
        </header>

        <div className="mt-8"><AdSlot key={company.cnpj} slotId="4065145505" /></div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-bold">Informações da empresa</h2>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div><dt className="text-sm text-muted-foreground">Situação</dt><dd className="mt-1 font-semibold">{company.situation ?? "Não informado"}</dd></div>
              <div><dt className="text-sm text-muted-foreground">Data de abertura</dt><dd className="mt-1 font-semibold">{formatDate(company.opening)}</dd></div>
              <div><dt className="text-sm text-muted-foreground">Natureza jurídica</dt><dd className="mt-1 font-semibold">{legalNature ?? "Não informado"}</dd></div>
              <div><dt className="text-sm text-muted-foreground">Última atualização</dt><dd className="mt-1 font-semibold">{formatDate(company.last_update)}</dd></div>
            </dl>
          </section>

          <section className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-bold">Endereço</h2>
            <p className="mt-5 leading-7 text-muted-foreground">{address || "Endereço não informado"}<br />{company.neighborhood && `${company.neighborhood}, `}{company.city}/{company.state}<br />{company.zip_code && `CEP ${company.zip_code}`}</p>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-bold">Atividade principal</h2>
          <p className="mt-4 text-muted-foreground">{activity?.code ? `${activity.code} - ` : ""}{activity?.name ?? "Não informada"}</p>
        </section>

        {!!company.secondary_activities?.length && <section className="mt-8 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Atividades secundárias</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">{company.secondary_activities.map((item, index) => <li key={index}>{item.activities?.code ? `${item.activities.code} — ` : ""}{item.activities?.name || "Não informada"}</li>)}</ul>
        </section>}

        {(company.phone || company.email) && <section className="mt-8 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-bold">Contato da empresa</h2>
          <div className="mt-4 flex flex-wrap gap-5">
            {company.phone && <a className="underline" href={`tel:${company.phone.replace(/[^+0-9]/g, "")}`}>Ligar para a empresa</a>}
            {company.email && <a className="underline" href={`mailto:${encodeURIComponent(company.email)}`}>Enviar e-mail</a>}
          </div>
        </section>}

        <section className="mt-8 text-sm leading-6 text-muted-foreground">
          <h2 className="font-semibold text-foreground">Sobre estes dados</h2>
          <p>Informações cadastrais provenientes de bases públicas do CNPJ. A situação cadastral informa o estado do registro e não é uma avaliação comercial da empresa. Para comprovação oficial, consulte a Receita Federal.</p>
          <a href="#solicitar-remocao" className="mt-2 inline-block underline">Solicitar remoção ou corrigir informações</a>
        </section>

        {process.env.CNPJ_EXTRA_AD_SLOT && <div className="my-10"><AdSlot key={company.cnpj} slotId={process.env.CNPJ_EXTRA_AD_SLOT} format="rectangle" /></div>}

        {relatedCompanies.length > 0 && <section className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Na mesma cidade</p>
          <h2 className="mt-2 text-2xl font-bold">Mais empresas em {company.city}/{company.state}</h2>
          <div className="mt-4 rounded-2xl border bg-card px-5 shadow-[var(--shadow-soft)]">
            {relatedCompanies.map((relatedCompany) => <CnpjCard key={relatedCompany.id} company={relatedCompany} />)}
          </div>
        </section>}
        <CnpjRequestForm cnpj={company.cnpj} />
      </main>
      <SiteFooter />
    </div>
  );
}
