"use client";

import { useEffect, useRef } from "react";

type AdFormat = "leaderboard" | "rectangle" | "billboard" | "mobile-banner";

const FORMAT_SIZES: Record<AdFormat, { width: number; height: number; label: string }> = {
  leaderboard: { width: 728, height: 90, label: "728 × 90" },
  billboard: { width: 970, height: 250, label: "970 × 250" },
  rectangle: { width: 300, height: 250, label: "300 × 250" },
  "mobile-banner": { width: 320, height: 100, label: "320 × 100" },
};

interface AdSlotProps {
  /** Google AdSense data-ad-slot id. Sem id, o espaço fica apenas reservado. */
  slotId?: string;
  format?: AdFormat;
  className?: string;
  label?: string;
}

/**
 * Espaço reservado para anúncios do Google (AdSense).
 * A área é sempre reservada com a altura final do bloco para evitar
 * deslocamento de layout (CLS) quando o anúncio carregar.
 */
export function AdSlot({
  slotId,
  format = "leaderboard",
  className = "",
  label = "Publicidade",
}: AdSlotProps) {
  const size = FORMAT_SIZES[format];
  const insRef = useRef<HTMLModElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!slotId || !clientId) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* anúncio indisponível */
    }
  }, [slotId, clientId]);

  return (
    <aside
      aria-label={label}
      className={`mx-auto flex w-full flex-col items-center gap-2 ${className}`}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
        {label}
      </span>
      <div
        className="flex w-full max-w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/40"
        style={{ maxWidth: size.width, minHeight: size.height }}
      >
        {slotId && clientId ? (
          <ins
            ref={insRef}
            className="adsbygoogle block"
            style={{ display: "block", width: "100%", height: size.height }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <span className="text-xs text-muted-foreground/60">Espaço para anúncio {size.label}</span>
        )}
      </div>
    </aside>
  );
}
