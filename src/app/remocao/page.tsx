import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RequestConfirmation } from "@/components/RequestConfirmation";
export const metadata: Metadata = { title: "Remoção e correção | Parafa CNPJ", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function RemovalPage() {
  return <><SiteHeader /><main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12"><h1 className="text-3xl font-bold">Remoção e correção de dados</h1><RequestConfirmation /></main><SiteFooter /></>;
}
