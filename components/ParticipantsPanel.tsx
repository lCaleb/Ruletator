"use client";

import { useMemo, useRef, useState } from "react";
import type { Participant } from "@/types/roulette";

type ParticipantsPanelProps = {
  participants: Participant[];
  value: string;
  onChange: (names: string) => void;
  onClear: () => void;
  onReset: () => void;
  onResetConfiguration: () => void;
};

export function ParticipantsPanel({ participants, value, onChange, onClear, onReset, onResetConfiguration }: ParticipantsPanelProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const resetClickTimeoutRef = useRef<number | null>(null);
  const renderedLines = useMemo(() => renderParticipantLines(value), [value]);

  function handleResetClick() {
    if (resetClickTimeoutRef.current) {
      return;
    }

    resetClickTimeoutRef.current = window.setTimeout(() => {
      onReset();
      resetClickTimeoutRef.current = null;
    }, 500);
  }

  function handleResetDoubleClick() {
    if (resetClickTimeoutRef.current) {
      window.clearTimeout(resetClickTimeoutRef.current);
      resetClickTimeoutRef.current = null;
    }

    onResetConfiguration();
  }

  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Participantes</h2>
        <span className="text-xs text-slate-500">{participants.length} activos</span>
      </div>
      <div className="relative min-h-[230px] rounded border border-slate-300 bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden p-3 text-sm leading-6 text-slate-950"
        >
          <div style={{ transform: `translateY(-${scrollTop}px)` }}>
            {renderedLines ?? <span className="text-slate-400">Ingresa las personas aqu&iacute;</span>}
          </div>
        </div>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          spellCheck={false}
          className="relative min-h-[230px] w-full resize-y rounded bg-transparent p-3 text-sm leading-6 text-transparent caret-slate-950 outline-none ring-blue-500 transition focus:ring-2"
          aria-label="Lista de participantes"
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onClear}
          className="px-2 py-1 text-left text-xs font-bold text-red-700 transition hover:bg-red-50"
        >
          Eliminar lista
        </button>
        <button
          type="button"
          onClick={handleResetClick}
          onDoubleClick={handleResetDoubleClick}
          className="px-2 py-1 text-left text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          title="Un click restaura tachados. Doble click borra configuracion."
        >
          Restablecer lista
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">La ruleta se actualiza al instante.</p>
    </section>
  );
}

function renderParticipantLines(value: string) {
  if (!value) {
    return null;
  }

  return value.split("\n").map((line, index) => {
    const struck = isStruckLine(line);
    const cleanLine = removeStrikeMarkers(line);

    return (
      <div
        key={index}
        className={`min-h-6 whitespace-pre-wrap ${struck ? "-mx-1 rounded bg-slate-300 px-1 text-slate-600" : ""}`}
      >
        {cleanLine ? <span className={struck ? "line-through decoration-[2px] decoration-slate-700" : undefined}>{cleanLine}</span> : "\u00a0"}
      </div>
    );
  });
}

function isStruckLine(value: string): boolean {
  const trimmed = value.trim();

  return value.includes("\u0336") || (trimmed.startsWith("~~") && trimmed.endsWith("~~"));
}

function removeStrikeMarkers(value: string): string {
  const withoutCombiningStrike = value.replace(/\u0336/g, "");
  const trimmed = withoutCombiningStrike.trim();

  if (trimmed.startsWith("~~") && trimmed.endsWith("~~")) {
    return withoutCombiningStrike.replace(/^(\s*)~~(.*)~~(\s*)$/, "$1$2$3");
  }

  return withoutCombiningStrike;
}
