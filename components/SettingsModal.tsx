"use client";

import { useState } from "react";
import { UNDEFINED_WINNER_ID } from "@/lib/storage";
import type { ConfiguredWinner, Participant, RouletteSettings } from "@/types/roulette";

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
  const initialConfiguredWinners = getInitialConfiguredWinners(settings);
  const [draft, setDraft] = useState<RouletteSettings>({
    ...settings,
    configuredWinners: initialConfiguredWinners
  });
  const [configuredWinnerInput, setConfiguredWinnerInput] = useState(initialConfiguredWinners.map((winner) => winner.name).join("\n"));
  const configuredWinnerRows = parseConfiguredWinnerInput(configuredWinnerInput);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4">
      <form
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded bg-white p-6 shadow-2xl"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            ...draft,
            configuredWinnerId: configuredWinnerRows[0]?.id ?? UNDEFINED_WINNER_ID,
            configuredWinnerName: configuredWinnerRows[0]?.name ?? "",
            configuredWinners: configuredWinnerRows
          });
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

        {draft.mode === "configured" ? (
          <div className="mb-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Orden configurado</span>
              <textarea
                value={configuredWinnerInput}
                onChange={(event) => setConfiguredWinnerInput(event.target.value)}
                placeholder={"Nombre para posicion 1\nNombre para posicion 2\nNombre para posicion 3"}
                className="min-h-[150px] w-full resize-y rounded border border-slate-300 px-3 py-2 text-sm leading-6 outline-none ring-blue-500 focus:ring-2"
              />
            </label>

            {configuredWinnerRows.length > 0 ? (
              <div className="mt-3 max-h-40 overflow-y-auto rounded border border-slate-200">
                {configuredWinnerRows.map((winner, index) => {
                  const winnerMatches = participants.some((participant) => sameName(participant.name, winner.name));

                  return (
                    <div key={`${index}-${winner.name}`} className="flex items-center gap-3 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0">
                      <strong className="w-20 shrink-0 text-slate-700">Posici&oacute;n {index + 1}</strong>
                      <span className="min-w-0 flex-1 truncate text-slate-900">{winner.name}</span>
                      {!winnerMatches ? <span className="shrink-0 text-xs text-slate-500">No coincide</span> : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

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

function getInitialConfiguredWinners(settings: RouletteSettings): ConfiguredWinner[] {
  if (settings.configuredWinners.length > 0) {
    return settings.configuredWinners;
  }

  if (settings.configuredWinnerId !== UNDEFINED_WINNER_ID || settings.configuredWinnerName.trim()) {
    return [{ id: settings.configuredWinnerId, name: settings.configuredWinnerName }];
  }

  return [];
}

function parseConfiguredWinnerInput(value: string): ConfiguredWinner[] {
  return value
    .split("\n")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({
      id: UNDEFINED_WINNER_ID,
      name
    }));
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
