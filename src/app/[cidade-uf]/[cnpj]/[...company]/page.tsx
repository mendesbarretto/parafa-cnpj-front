import Link from "next/link";
import { notFound } from "next/navigation";
import { CnpjCard } from "@/components/CnpjCard";
import { AdSlot } from "@/components/AdSlot";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchCnpjCity, fetchCnpjCompany } from "@/lib/api";

type CompanyPageProps = {
  params: Promise<{ "cidade-uf": string; cnpj: string; company: string[] }>;
};

function formatDate(value?: string | null) {
  if (!value) return "Não informado";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR");
}

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 14) return value;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export async function generateMetadata({ params }: CompanyPageProps) {
  const { cnpj } = await params;
  const response = await fetchCnpjCompany(cnpj);
  const company = response?.data;

  return {
    title: company ? `${company.name} | Parafa CNPJ` : "Empresa não encontrada | Parafa CNPJ",
    description: company ? `Consulte os dados públicos de ${company.name} em ${company.city ?? "sua cidade"}.` : "Consulta de empresas CNPJ.",
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { cnpj, "cidade-uf": citySlug } = await params;
  const response = await fetchCnpjCompany(cnpj);
  const company = response?.data;

  if (!company) notFound();

  let relatedCompanies = Array.isArray(response?.related) ? response.related : [];
  if (relatedCompanies.length === 0) {
    const cityResponse = await fetchCnpjCity(citySlug);
    relatedCompanies = Array.isArray(cityResponse?.data)
      ? cityResponse.data.filter((item) => item.cnpj !== company.cnpj)
      : [];
  }

  const legalNature = typeof company.legal_nature === "string" ? company.legal_nature : company.legal_nature?.name;
  const activity = company.activity ?? (typeof company.activities === "object" && company.activities !== null ? company.activities as { code?: string; name?: string } : null);
  const address = [company.street, company.complement].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <nav className="text-sm text-muted-foreground"><Link href={`/${citySlug}`} className="hover:text-primary">{company.city}/{company.state}</Link> <span className="px-2">/</span> Empresa</nav>

        <header className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Cadastro nacional</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{company.name}</h1>
          {company.fantasy && <p className="mt-2 text-lg text-muted-foreground">{company.fantasy}</p>}
          <p className="mt-4 text-base text-muted-foreground">CNPJ: {formatCnpj(company.cnpj)}</p>
        </header>

        <div className="mt-8"><AdSlot slotId="4065145505" /></div>

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

        {relatedCompanies.length > 0 && <section className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Na mesma cidade</p>
          <h2 className="mt-2 text-2xl font-bold">Mais empresas em {company.city}/{company.state}</h2>
          <div className="mt-4 rounded-2xl border bg-card px-5 shadow-[var(--shadow-soft)]">
            {relatedCompanies.map((relatedCompany) => <CnpjCard key={relatedCompany.id} company={relatedCompany} />)}
          </div>
        </section>}
      </main>
      <SiteFooter />
    </div>
  );
}
