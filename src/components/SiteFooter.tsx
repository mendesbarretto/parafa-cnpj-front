import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
        <span className="font-extrabold tracking-tight text-primary-deep">parafa</span>
        <nav aria-label="Informações institucionais" className="flex flex-wrap justify-center gap-4">
          <a href="https://parafa.com.br/contato" className="hover:underline">Contato</a>
          <Link href="/politica-de-privacidade" className="hover:underline">Privacidade</Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/remocao" className="hover:underline">Remoção e correção</a>
        </nav>
        <p>© {new Date().getFullYear()} Parafa. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
