import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  async redirects() {
    return [
      { source: "/pol%C3%ADtica-de-privacidade", destination: "/politica-de-privacidade", permanent: true },
      { source: "/política-de-privacidade", destination: "/politica-de-privacidade", permanent: true },
      { source: "/index-sitemap/:page/indexSitemap.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/remocao", headers: [{ key: "Referrer-Policy", value: "no-referrer" }, { key: "Cache-Control", value: "private, no-store" }] }];
  },
  generateEtags: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    useTypeScriptCli: false,
    webpackBuildWorker: false,
    memoryBasedWorkersCount: false,
    cpus: 1,
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
