import type { CnpjCompany } from "@/lib/api";
import Link from "next/link";

export function CnpjCard({ company }: { company: CnpjCompany }) {
  const companyPath = company.url?.replace(/^\/+/, "");
  const href = companyPath ? `/${companyPath}` : `/busca?search=${encodeURIComponent(company.cnpj)}`;
  return (
    <article className="border-b border-border py-5 last:border-0">
      <Link href={href} className="block hover:text-primary">
        <h3 className="font-semibold text-card-foreground">{company.name}</h3>
        {company.fantasy && <p className="mt-1 text-sm text-muted-foreground">{company.fantasy}</p>}
        <p className="mt-2 text-sm text-muted-foreground">CNPJ {company.cnpj} {company.city && `• ${company.city}/${company.state ?? ""}`}</p>
      </Link>
    </article>
  );
}