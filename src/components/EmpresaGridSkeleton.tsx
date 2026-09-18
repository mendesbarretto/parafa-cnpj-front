export function EmpresaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Carregando empresas">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col rounded-2xl border border-border bg-card p-6">
          <div className="h-6 w-28 animate-pulse rounded-full bg-secondary" />
          <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-secondary" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="mt-6 h-4 w-1/2 animate-pulse rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}
