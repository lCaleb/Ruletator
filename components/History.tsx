"use client";

import { AdSlot } from "@/components/AdSlot";
export function History() {
  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-4">
        <AdSlot variant="compact" />
        <AdSlot variant="compact" />
      </div>
    </section>
  );
}
