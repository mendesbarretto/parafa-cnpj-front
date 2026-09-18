import Link from "next/link";
import { MapPin, Phone, ArrowRight, BadgeCheck, MessageCircle } from "lucide-react";
import type { Empresa } from "@/lib/api";

interface EmpresaCardProps {
  empresa: Empresa;
}

export function EmpresaCard({ empresa }: EmpresaCardProps) {
  const categoryDisplay = empresa.category_name || "Comércio e Serviços";
  const mainPhone = empresa.phone;
  const whatsappUrl = empresa.whatsapp_url;
  const addressDisplay = empresa.neighborhood 
    ? `${empresa.neighborhood} — ${empresa.city}/${empresa.state}`
    : `${empresa.city}/${empresa.state}`;

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-3">
        <span
          className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary truncate max-w-[220px]"
          title={categoryDisplay}
        >
          {categoryDisplay}
        </span>
        {empresa.status === "1" && (
          <div title="Empresa Verificada">
            <BadgeCheck className="size-4 shrink-0 text-primary" />
          </div>
        )}
      </div>

      <h2 className="mt-4 text-base font-semibold leading-snug text-card-foreground line-clamp-2">
        <Link href={empresa.url} className="hover:text-primary transition-colors">
          {empresa.name}
        </Link>
      </h2>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground flex-1">
        {empresa.slogan || empresa.description || "Telefones, endereço e horário de atendimento atualizados."}
      </p>

      {/* Bloco de telefones / contatos da v3 */}
      <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
        {mainPhone ? (
          <Link
            href={empresa.url}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            title="Ver telefone da empresa"
          >
            <Phone className="size-3.5 text-primary" />
            <span>Ver telefone</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="size-3.5 opacity-50" />
            <span>Ver telefone</span>
          </span>
        )}

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#128C7E] bg-emerald-50 px-2.5 py-1 rounded-full hover:bg-emerald-100 transition-colors"
            title="Conversar no WhatsApp"
          >
            <MessageCircle className="size-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-[180px]">
          <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{addressDisplay}</span>
        </span>
        <Link
          href={empresa.url}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
        >
          Ver detalhes <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
