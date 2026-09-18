export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
        <span className="font-extrabold tracking-tight text-primary-deep">parafa</span>
        <p>© {new Date().getFullYear()} Parafa. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
