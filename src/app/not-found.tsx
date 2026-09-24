import Link from "next/link";
export default function NotFound() {
  return <main className="mx-auto max-w-3xl px-5 py-20"><h1 className="text-2xl font-bold">Página não encontrada</h1><p className="mt-4">O cadastro pode estar indisponível ou ter sido removido.</p><Link href="/busca" className="mt-6 inline-block underline">Buscar outra empresa</Link></main>;
}
