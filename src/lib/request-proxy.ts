import { NextRequest } from "next/server";

export async function proxyRequest(request: NextRequest, path: string) {
  const origin = request.headers.get("origin");
  let sameHost = false;
  try {
    const parsedOrigin = new URL(origin || "");
    sameHost = ["http:", "https:"].includes(parsedOrigin.protocol) && parsedOrigin.host === request.headers.get("host");
  } catch { /* A missing or malformed Origin is rejected. */ }
  if (!sameHost && origin !== request.nextUrl.origin && origin !== "https://cnpj.parafa.com.br") {
    return Response.json({ message: "Origem não permitida." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return Response.json({ message: "Formato inválido." }, { status: 415 });
  }
  try {
    const reader = request.body?.getReader();
    if (!reader) return Response.json({ message: "Pedido vazio." }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) {
        await reader.cancel();
        return Response.json({ message: "Pedido muito longo." }, { status: 413 });
      }
      chunks.push(value);
    }
    let body: unknown;
    try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
    catch { return Response.json({ message: "Pedido inválido." }, { status: 400 }); }
    const response = await fetch(`${process.env.API_URL || "http://localhost:8000/api"}/cnpj/${path}`, {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    if (!response.ok) {
      const message = response.status === 429 ? "Muitas tentativas. Aguarde e tente novamente."
        : response.status === 410 ? "Este link expirou. Faça uma nova solicitação ou entre em contato."
        : response.status === 404 ? "Cadastro ou solicitação não encontrado. Confira o link."
        : response.status === 422 ? "Confira os campos obrigatórios e os dados informados."
        : "Serviço temporariamente indisponível. Tente novamente mais tarde.";
      return Response.json({ message }, { status: response.status, headers: { "Cache-Control": "no-store" } });
    }
    return Response.json(result, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "Não foi possível concluir. Tente novamente mais tarde." }, { status: 503 });
  }
}
