import type { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/request-proxy";
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string; action: string }> }) {
  const { id, action } = await params;
  if (!/^[a-f0-9-]{36}$/i.test(id) || !["confirm", "status"].includes(action)) return new Response(null, { status: 404 });
  return proxyRequest(request, `requests/${id}/${action}`);
}
