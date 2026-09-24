import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteScripts } from "@/components/SiteScripts";
import { SITE_URL, jsonLd } from "@/lib/company";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: { type: "website", locale: "pt_BR", siteName: "Parafa CNPJ" },
  title: "Parafa CNPJ | Consulte empresas do Brasil",
  description: "Consulte empresas, CNPJ, atividades e cidades de todo o Brasil.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Organization", name: "Parafa", url: SITE_URL, contactPoint: { "@type": "ContactPoint", contactType: "customer service", url: "https://parafa.com.br/contato", availableLanguage: "Portuguese" } }) }} />
        <SiteScripts />
      </body>
    </html>
  );
}
