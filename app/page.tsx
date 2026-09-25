"use client";

import { useEffect, useState } from "react";
import { AdSlot } from "@/components/AdSlot";
import { History } from "@/components/History";
import { ParticipantsPanel } from "@/components/ParticipantsPanel";
import { ResultBar } from "@/components/ResultBar";
import { SettingsModal } from "@/components/SettingsModal";
import { Wheel } from "@/components/Wheel";
import { useRoulette } from "@/hooks/useRoulette";
import { useWheelColors } from "@/hooks/useWheelColors";

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const roulette = useRoulette();
  const wheelColors = useWheelColors(roulette.participants);
  const visibleResult = roulette.activeResult ?? roulette.hiddenResult;
  const visibleResultColor =
    visibleResult && roulette.participants.length > 0
      ? wheelColors[roulette.participants.findIndex((participant) => participant.id === visibleResult.participant.id)]
      : undefined;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.altKey && event.code === "KeyR") {
        event.preventDefault();
        setSettingsOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-[#fbf7f7] text-slate-950">
      <header className="mx-auto flex max-w-7xl items-center bg-slate-800 px-5 py-3 text-white">
        <nav className="flex flex-wrap items-center gap-5 text-sm">
          <strong>Ruleta</strong>
          <span className="text-slate-300">Dado</span>
          <span className="text-slate-300">N&uacute;meros al azar</span>
          <span className="text-slate-300">Moneda</span>
          <span className="text-slate-300">Barajar</span>
        </nav>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-5 lg:grid-cols-[300px_minmax(360px,1fr)_310px]">
        <div className="order-3 space-y-6 lg:order-1">
          <AdSlot />
          <AdSlot variant="large" />
        </div>

        <section className="order-1 text-center lg:order-2">
          <h1 className="mb-5 text-4xl font-black tracking-normal md:text-5xl">{roulette.settings.title}</h1>
          <Wheel
            participants={roulette.participants}
            rotation={roulette.rotation}
            duration={roulette.settings.spinDuration}
            colors={wheelColors}
            isSpinning={roulette.isSpinning}
            canSpin={!roulette.isSpinning && roulette.participants.length > 0}
            showHint={roulette.showSpinHint}
            onSpin={roulette.spin}
          />
          <button
            type="button"
            onClick={roulette.spin}
            disabled={roulette.isSpinning || roulette.participants.length < 1}
            className="mt-6 rounded bg-blue-600 px-8 py-4 text-lg font-black text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {roulette.isSpinning ? "Girando..." : "Girar"}
          </button>
          <ResultBar
            result={visibleResult}
            color={visibleResultColor}
            hidden={!roulette.activeResult && Boolean(roulette.hiddenResult)}
            isRemoving={roulette.removingParticipantId === roulette.activeResult?.participant.id}
            onReset={roulette.clearResult}
            onRemove={roulette.removeActiveResultParticipant}
          />
          <p className="mx-auto mt-6 max-w-2xl text-left text-sm leading-7 text-slate-700">
            Esta es una herramienta en l&iacute;nea para elegir el nombre o el art&iacute;culo al azar. Tambi&eacute;n se llama selector de nombres
            aleatorios, rueda de nombres o ruleta en l&iacute;nea. Puede modificar los nombres en el textarea, poner un nombre por l&iacute;nea y girar
            la ruleta.
          </p>
        </section>

        <div className="order-2 space-y-6 lg:order-3">
          <ParticipantsPanel
            participants={roulette.participants}
            value={roulette.participantInput}
            title={roulette.settings.title}
            onChange={roulette.updateParticipants}
            onTitleChange={roulette.updateTitle}
            onClear={roulette.clearParticipants}
            onReset={roulette.resetParticipants}
            onResetConfiguration={roulette.resetParticipantsConfiguration}
          />
          <History />
        </div>
      </div>

      <SettingsModal
        open={settingsOpen}
        participants={roulette.participants}
        settings={roulette.settings}
        onClose={() => setSettingsOpen(false)}
        onSave={roulette.updateSettings}
      />
    </main>
  );
}
