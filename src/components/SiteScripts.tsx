"use client";
import { usePathname } from "next/navigation";
import { GoogleAdSense } from "./GoogleAdSense";
import { GoogleAnalytics } from "./GoogleAnalytics";
export function SiteScripts() {
  const path = usePathname();
  if (path === "/remocao" || path === "/politica-de-privacidade") return null;
  return <><GoogleAnalytics /><GoogleAdSense /></>;
}
