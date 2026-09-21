import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { GoogleAdSense } from "@/components/GoogleAdSense";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Parafa CNPJ | Consulte empresas do Brasil",
  description: "Consulte empresas, CNPJ, atividades e cidades de todo o Brasil.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <GoogleAnalytics />
        <GoogleAdSense />
      </body>
    </html>
  );
}
