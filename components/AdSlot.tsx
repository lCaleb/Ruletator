"use client";

import { useEffect, useRef } from "react";
import { useAdReady } from "@/components/AdProvider";
import { DemoAd } from "@/components/DemoAd";
import { adsenseClient, demoAdsEnabled, isAdSlotConfigured } from "@/lib/ads";

declare global {
  interface Window { adsbygoogle?: Record<string, unknown>[]; }
}

type AdSlotProps = { slot: string; variant?: "small" | "large" | "compact"; demoOffset?: number; };

export function AdSlot({ slot, variant = "small", demoOffset = 0 }: AdSlotProps) {
  const ready = useAdReady();
  const adRef = useRef<HTMLModElement>(null);
  const requested = useRef(false);
  const configured = isAdSlotConfigured(slot);
  const sizeClass = variant === "compact" ? "min-h-[120px]" : variant === "large" ? "min-h-[280px]" : "min-h-[250px]";

  useEffect(() => {
    const element = adRef.current;
    if (!configured || !ready || !element || requested.current) return;
    const requestAd = () => {
      // Responsive ads need a visible parent with a nonzero width.
      if (requested.current || element.getBoundingClientRect().width <= 0) return;
      requested.current = true;
      observer.disconnect();
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
      catch { /* An unavailable ad must never interrupt the roulette. */ }
    };
    const observer = new ResizeObserver(requestAd);
    observer.observe(element);
    requestAd();
    return () => observer.disconnect();
  }, [configured, ready]);

  if (demoAdsEnabled) {
    return <DemoAd compact={variant === "compact"} large={variant === "large"} offset={demoOffset} />;
  }

  return (
    <aside aria-label="Publicidad" className={`min-w-0 rounded border border-slate-200 bg-white p-3 ${sizeClass}`}>
      <p className="mb-3 text-center text-[10px] uppercase tracking-widest text-slate-500">Publicidad</p>
      {configured ? (
        <ins ref={adRef} className="adsbygoogle" style={{ display: "block", width: "100%" }}
          data-ad-client={adsenseClient} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
      ) : (
        <div className={`grid place-items-center rounded bg-slate-50 px-4 text-center text-sm text-slate-400 ${variant === "compact" ? "min-h-[70px]" : "min-h-[190px]"}`}>
          Espacio publicitario
        </div>
      )}
    </aside>
  );
}
