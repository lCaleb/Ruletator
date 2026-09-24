"use client";

import { useState } from "react";
import { UNDEFINED_WINNER_ID } from "@/lib/storage";
import type { Participant, RouletteSettings } from "@/types/roulette";

type SettingsModalProps = {
  open: boolean;
  participants: Participant[];
  settings: RouletteSettings;
  onClose: () => void;
  onSave: (settings: RouletteSettings) => void;
};

export function SettingsModal({ open, participants, settings, onClose, onSave }: SettingsModalProps) {
  if (!open) {
    return null;
  }

  return <SettingsForm participants={participants} settings={settings} onClose={onClose} onSave={onSave} />;
}

function SettingsForm({ participants, settings, onClose, onSave }: Omit<SettingsModalProps, "open">) {
  const [draft, setDraft] = useState(settings);
  const manualWinnerMatches = participants.some((participant) => sameName(participant.name, draft.configuredWinnerName));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4">
      <form
        className="w-full max-w-md rounded bg-white p-6 shadow-2xl"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
          onClose();
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-slate-950">Configuraci&oacute;n</h2>
          <button type="button" onClick={onClose} className="rounded px-3 py-1 text-xl text-slate-500 hover:bg-slate-100">
            x
          </button>
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">T&iacute;tulo</span>
          <input
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Duraci&oacute;n del giro</span>
          <input
            type="number"
            min={1}
            max={20}
            value={draft.spinDuration}
            onChange={(event) => setDraft((current) => ({ ...current, spinDuration: Number(event.target.value) }))}
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2"
          />
        </label>

        <fieldset className="mb-4">
          <legend className="mb-2 text-sm font-semibold text-slate-700">Modo</legend>
          <label className="mb-2 flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={draft.mode === "random"}
              onChange={() => setDraft((current) => ({ ...current, mode: "random" }))}
            />
            Aleatorio
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={draft.mode === "configured"}
              onChange={() => setDraft((current) => ({ ...current, mode: "configured" }))}
            />
            Configurado
          </label>
        </fieldset>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Ganador configurado</span>
          <input
            value={draft.configuredWinnerName}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                configuredWinnerName: event.target.value
              }))
            }
            placeholder="Escribe un nombre"
            className="mb-2 w-full rounded border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2"
          />
          <select
            value={draft.configuredWinnerId}
            onChange={(event) => {
              const participant = participants.find((item) => item.id === event.target.value);
              setDraft((current) => ({
                ...current,
                configuredWinnerId: event.target.value,
                configuredWinnerName: participant?.name ?? current.configuredWinnerName
              }));
            }}
            className="w-full rounded border border-slate-300 px-3 py-2 outline-none ring-blue-500 focus:ring-2"
          >
            <option value={UNDEFINED_WINNER_ID}>Sin definir</option>
            {draft.configuredWinnerId !== UNDEFINED_WINNER_ID && !participants.some((participant) => participant.id === draft.configuredWinnerId) ? (
              <option value={draft.configuredWinnerId}>Sin ganador configurado v&aacute;lido</option>
            ) : null}
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
          {draft.configuredWinnerName.trim() && !manualWinnerMatches ? (
            <span className="mt-1 block text-xs text-slate-500">Guardado, pero no coincide con la lista activa.</span>
          ) : null}
        </label>

        <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={draft.sound}
            onChange={(event) => setDraft((current) => ({ ...current, sound: event.target.checked }))}
          />
          Sonido
        </label>
        <label className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={draft.confetti}
            onChange={(event) => setDraft((current) => ({ ...current, confetti: event.target.checked }))}
          />
          Confeti
        </label>

        <button type="submit" className="w-full rounded bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700">
          Guardar
        </button>
      </form>
    </div>
  );
}

function sameName(left: string, right: string): boolean {
  return normalizeName(left) === normalizeName(right);
}

function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^[^a-zA-Z0-9]*\d+[^a-zA-Z0-9]+(?=[a-zA-Z])/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}
