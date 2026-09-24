"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export function CnpjRequestForm({ cnpj }: { cnpj: string }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const field = "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/solicitacoes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, cnpj }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Não foi possível enviar. Tente novamente.");
      setSent(true);
      setMessage(`${result.message} Protocolo: ${result.protocol}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar.");
    } finally { setBusy(false); }
  }

  return <section id="solicitar-remocao" className="mt-10 scroll-mt-24 rounded-2xl border bg-card p-6">
    <h2 className="text-xl font-bold">Solicitar remoção ou correção</h2>
    <p className="mt-3 text-sm text-muted-foreground">Este pedido se refere ao CNPJ {cnpj}. Confirme seu e-mail para encaminhá-lo à análise. Podemos pedir informações adicionais para verificar seu vínculo com os dados.</p>
    {!sent && <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
      <label>Nome<input required minLength={2} maxLength={150} autoComplete="name" name="name" className={field} /></label>
      <label>E-mail<input required type="email" maxLength={254} autoComplete="email" name="email" className={field} /></label>
      <label>Solicitação<select name="action" className={field} defaultValue="removal"><option value="removal">Remover do site</option><option value="correction">Corrigir informações</option></select></label>
      <label>Seu vínculo<select required name="relationship" className={field} defaultValue=""><option value="" disabled>Selecione</option><option value="responsavel">Responsável pela empresa</option><option value="representante">Representante autorizado</option><option value="titular">Titular dos dados</option><option value="outro">Outro vínculo</option></select></label>
      <label className="sm:col-span-2">Descreva o pedido<textarea required minLength={10} maxLength={3000} name="message" rows={4} className={field} /><span className="text-xs text-muted-foreground">Não envie senhas, CPF ou documentos pessoais neste campo.</span></label>
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="flex items-start gap-2 text-sm sm:col-span-2"><input type="checkbox" required name="acknowledged" value="1" className="mt-1" /><span>Declaro que as informações são verdadeiras e li a <Link href="/politica-de-privacidade" className="underline">política de privacidade</Link>.</span></label>
      <button disabled={busy} type="submit" className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Enviando…" : "Enviar solicitação"}</button>
    </form>}
    <p role="status" aria-live="polite" className="mt-4 break-words text-sm">{message}</p>
  </section>;
}
