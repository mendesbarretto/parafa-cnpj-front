"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const measurementId = process.env.NEXT_PUBLIC_GA_ID ?? "G-ZPRHZCQG09";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    const firstPage = lastPath.current === null;
    lastPath.current = pathname;
    const analytics = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
    analytics.dataLayer = analytics.dataLayer || [];
    analytics.gtag = analytics.gtag || ((...args: unknown[]) => { analytics.dataLayer!.push(args); });
    if (firstPage) {
      analytics.gtag("js", new Date());
      analytics.gtag("config", measurementId, { send_page_view: false });
    }
    const group = pathname === "/" ? "home" : pathname === "/busca" ? "busca" : pathname === "/cidades" ? "cidades" : pathname.split("/").filter(Boolean).length >= 2 ? "empresa" : "cidade";
    analytics.gtag("event", "page_view", {
      send_to: measurementId,
      page_location: window.location.origin + pathname,
      page_title: document.title,
      content_group: group,
    });
  }, [pathname]);
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />;
}
