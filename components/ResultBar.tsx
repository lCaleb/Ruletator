"use client";

import type { RouletteResult } from "@/types/roulette";

type ResultBarProps = {
  result: RouletteResult | null;
  isRemoving: boolean;
  onReset: () => void;
  onRemove: () => void;
};

export function ResultBar({ result, isRemoving, onReset, onRemove }: ResultBarProps) {
  if (!result) {
    return null;
  }

  return (
    <div className="mx-auto mt-5 flex w-full max-w-2xl items-center gap-3 rounded border-4 border-fuchsia-300 bg-fuchsia-300 px-2 py-1">
      <button
        type="button"
        onClick={onReset}
        className="grid h-7 w-7 shrink-0 place-items-center rounded border border-slate-700 bg-white text-lg font-black leading-none text-slate-950"
        aria-label="Restablecer resultado"
      >
        x
      </button>
      <p className={`min-w-0 flex-1 text-center text-4xl leading-none text-slate-900 ${isRemoving ? "line-through" : ""}`}>
        {result.participant.name}
      </p>
      <button
        type="button"
        onClick={onRemove}
        disabled={isRemoving}
        className="grid h-7 w-7 shrink-0 place-items-center rounded border border-slate-700 bg-white text-lg font-black leading-none text-slate-950 disabled:opacity-60"
        aria-label="Eliminar ganador de la lista"
      >
        s
      </button>
    </div>
  );
}
