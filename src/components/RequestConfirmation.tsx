"use client";

import { useSyncExternalStore, useState } from "react";
import Link from "next/link";

const labels: Record<string, string> = {
  pending_email: "Confirme abaixo para encaminhar seu pedido à análise.",
  pending_review: "E-mail confirmado. Sua solicitação está em análise.",
  removed: "Solicitação aprovada. O cadastro foi ocultado do Parafa CNPJ. Os buscadores podem levar algum tempo para atualizar seus resultados.",
  rejected: "A solicitação não foi aprovada. Entre em contato com o Parafa informando seu protocolo para mais informações.",
  resolved: "A análise da solicitação de correção foi concluída. Entre em contato com seu protocolo se precisar de mais informações.",
};

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
const emptyHash = () => "";
const currentHash = () => window.location.hash;

export function RequestConfirmation() {
  const hashValue = useSyncExternalStore(subscribe, currentHash, emptyHash);
  const hash = new URLSearchParams(hashValue.slice(1));
  const id = hash.get("id"), token = hash.get("token");
  const credentials = id && token ? { id, token } : null;
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);


  async function act(action: "status" | "confirm") {
    if (!credentials) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/solicitacoes/${credentials.id}/${action}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: credentials.token }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setStatus(result.status);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Tente novamente."); }
    finally { setBusy(false); }
  }

  return <div className="mt-6 space-y-5">
    {!credentials ? <p>Para solicitar a remoção ou correção, <Link href="/busca" className="underline">localize o CNPJ</Link> e use o formulário na página da empresa. Se já recebeu um e-mail, abra o link completo para confirmar e acompanhar o pedido. Links antigos devem ser substituídos por uma nova solicitação.</p>
      : <><p className="break-words text-sm">Protocolo: {credentials.id}</p><p>{labels[status] || "Confirme seu e-mail para enviar o pedido à análise ou consulte o andamento."}</p>
        <div className="flex flex-wrap gap-3">
          {(!status || status === "pending_email") && <button disabled={busy} onClick={() => act("confirm")} className="rounded-lg bg-primary px-5 py-3 text-primary-foreground disabled:opacity-60">Confirmar solicitação</button>}
          <button disabled={busy} onClick={() => act("status")} className="rounded-lg border px-5 py-3 disabled:opacity-60">Consultar andamento</button>
        </div></>}
    <p role="status" aria-live="polite">{busy ? "Aguarde…" : message}</p>
    <p className="text-sm text-muted-foreground">Precisa de ajuda? <a className="underline" href="https://parafa.com.br/contato">Entre em contato</a>.</p>
  </div>;
}
