import type { Participant } from "@/types/roulette";

type ParticipantsPanelProps = {
  participants: Participant[];
  value: string;
  onChange: (names: string) => void;
  onClear: () => void;
  onReset: () => void;
};

export function ParticipantsPanel({ participants, value, onChange, onClear, onReset }: ParticipantsPanelProps) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Participantes</h2>
        <span className="text-xs text-slate-500">{participants.length} activos</span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ingresa las personas aqu&iacute;"
        className="min-h-[230px] w-full resize-y rounded border border-slate-300 bg-white p-3 text-sm leading-6 outline-none ring-blue-500 transition focus:ring-2"
        aria-label="Lista de participantes"
      />
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
          onClick={onReset}
          className="px-2 py-1 text-left text-xs font-bold text-slate-700 transition hover:bg-slate-100"
        >
          Restablecer lista
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">La ruleta se actualiza al instante.</p>
    </section>
  );
}
