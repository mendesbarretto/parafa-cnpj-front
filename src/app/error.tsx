"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-3xl px-5 py-20"><h1 className="text-2xl font-bold">Consulta temporariamente indisponível</h1><p className="mt-4">Não foi possível carregar os dados agora. Tente novamente em alguns instantes.</p><button onClick={reset} className="mt-6 rounded-lg bg-primary px-5 py-3 text-primary-foreground">Tentar novamente</button></main>;
}
