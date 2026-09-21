import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  generateEtags: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    memoryBasedWorkersCount: false,
    cpus: 1,
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
