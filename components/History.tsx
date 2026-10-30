"use client";

import { AdSlot } from "@/components/AdSlot";
import { adSlots } from "@/lib/ads";
export function History() {
  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-4">
        <AdSlot slot={adSlots.panelTop} variant="compact" demoOffset={2} />
        <AdSlot slot={adSlots.panelBottom} variant="compact" />
      </div>
    </section>
  );
}
