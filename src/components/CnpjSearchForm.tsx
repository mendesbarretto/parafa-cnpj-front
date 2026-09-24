import { Search } from "lucide-react";

export function CnpjSearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/busca" className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="search">CNPJ ou nome da empresa</label>
      <input id="search" name="search" defaultValue={defaultValue} minLength={3} maxLength={120} className="min-h-12 flex-1 rounded-xl border border-input bg-card px-4 text-card-foreground outline-none ring-ring placeholder:text-muted-foreground focus:ring-2" placeholder="CNPJ ou nome da empresa" />
      <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary-deep" type="submit"><Search className="size-4" /> Buscar</button>
    </form>
  );
}