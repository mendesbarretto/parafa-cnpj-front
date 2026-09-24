import type { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/request-proxy";
export async function POST(request: NextRequest) {
  return proxyRequest(request, "requests");
}
