"use client";

import type { RouletteResult } from "@/types/roulette";

type ResultBarProps = {
  result: RouletteResult | null;
  color?: string;
  isRemoving: boolean;
  hidden: boolean;
  onReset: () => void;
  onRemove: () => void;
};

export function ResultBar({ result, color, isRemoving, hidden, onReset, onRemove }: ResultBarProps) {
  if (!result) {
    return null;
  }

  return (
    <div
      className="mx-auto mt-5 flex w-full max-w-2xl items-center gap-3 rounded border-4 px-2 py-1"
      style={{
        backgroundColor: color ?? "#f0abfc",
        borderColor: color ?? "#f0abfc"
      }}
    >
      <button
        type="button"
        onClick={onReset}
        className="grid h-7 w-7 shrink-0 place-items-center rounded border border-slate-700 bg-white text-lg font-black leading-none text-slate-950"
        aria-label="Cerrar mensaje"
        title="Cerrar mensaje"
      >
        x
      </button>
      <p className="min-w-0 flex-1 text-center text-4xl leading-none text-slate-900">
        <span className="relative inline-block max-w-full truncate align-middle">
          <strong>{result.participant.name}</strong>
          {hidden ? <span className="font-normal"> se ha ocultado</span> : null}
          {isRemoving ? <span className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-slate-900" aria-hidden="true" /> : null}
        </span>
      </p>
      {!hidden ? (
        <button
          type="button"
          onClick={onRemove}
          disabled={isRemoving}
          className="grid h-7 w-7 shrink-0 place-items-center rounded border border-slate-700 bg-white text-lg font-black leading-none text-slate-950 disabled:opacity-60"
          aria-label={`Ocultar "${result.participant.name}"`}
          title={`Ocultar "${result.participant.name}"`}
        >
          s
        </button>
      ) : null}
    </div>
  );
}
