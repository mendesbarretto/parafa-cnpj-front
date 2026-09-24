import Link from "next/link";
import { MapPin } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="size-4" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-primary-deep">parafa</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <Link
            href="/busca"
            className="transition-colors hover:text-primary"
          >
            Buscar empresas
          </Link>
          <Link
            href="/cidades"
            className="transition-colors hover:text-primary"
          >
            Cidades
          </Link>
          <Link
            href="https://parafa.com.br/contato"
            className="transition-colors hover:text-primary"
          >
            Fale conosco
          </Link>
        </nav>
        <Link
          href="https://parafa.com.br/contato"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
        >
          Anuncie grátis
        </Link>
      </div>
    </header>
  );
}
