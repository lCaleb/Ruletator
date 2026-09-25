"use client";

import type { ReactNode } from "react";
import { describeSector, getSectorCenterAngle, polarToCartesian } from "@/lib/wheel";
import type { Participant } from "@/types/roulette";

type WheelProps = {
  participants: Participant[];
  rotation: number;
  duration: number;
  colors: string[];
  isSpinning: boolean;
  canSpin: boolean;
  showHint: boolean;
  onSpin: () => void;
};

export function Wheel({ participants, rotation, duration, colors, isSpinning, canSpin, showHint, onSpin }: WheelProps) {
  const total = participants.length;
  const sectorAngle = 360 / total;
  const labelRadius = total <= 3 ? 102 : 132;
  const maxLabelWidth = total <= 3 ? 150 : total <= 8 ? 118 : Math.max(72, Math.min(128, (sectorAngle / 360) * 430));

  if (total === 0) {
    return (
      <div className="relative mx-auto grid min-h-[170px] w-full max-w-[540px] place-items-center rounded-2xl border border-slate-400 bg-white text-center">
        <div className="px-4">
          <p className="text-4xl font-normal text-slate-950 md:text-5xl">Por favor ingrese a la lista</p>
          <p className="mt-8 text-4xl font-bold tracking-[0.35em] text-slate-800">&rarr; &rarr; &rarr;</p>
        </div>
      </div>
    );
  }

  if (total === 1) {
    return (
      <WheelShell canSpin={canSpin} showHint={showHint} onSpin={onSpin}>
        <WheelPointer />
        <svg
          viewBox="0 0 420 420"
          className="h-full w-full drop-shadow-wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? `transform ${duration}s cubic-bezier(0.12, 0.76, 0.15, 1)` : "none"
          }}
          aria-label="Ruleta"
        >
          <circle cx="210" cy="210" r="198" fill={colors[0] ?? "#e2e8f0"} stroke="rgba(15, 23, 42, 0.22)" strokeWidth="1" />
          <text
            x="210"
            y="96"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#050505"
            fontSize={getLabelFontSize(participants[0].name, total, 118)}
            fontWeight="700"
            transform="rotate(90 210 96)"
          >
            {participants[0].name}
          </text>
          <circle cx="210" cy="210" r="22" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
        </svg>
      </WheelShell>
    );
  }

  return (
    <WheelShell canSpin={canSpin} showHint={showHint} onSpin={onSpin}>
      <WheelPointer />
      <svg
        viewBox="0 0 420 420"
        className="h-full w-full drop-shadow-wheel"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? `transform ${duration}s cubic-bezier(0.12, 0.76, 0.15, 1)` : "none"
        }}
        aria-label="Ruleta"
      >
        <g>
          {participants.map((participant, index) => {
            const startAngle = index * sectorAngle;
            const endAngle = startAngle + sectorAngle;
            const textAngle = getSectorCenterAngle(index, total);
            const textPosition = polarToCartesian(210, 210, labelRadius, textAngle);

            return (
              <g key={participant.id}>
                <path
                  d={describeSector(210, 210, 198, startAngle, endAngle)}
                  fill={colors[index] ?? "#e2e8f0"}
                  stroke="rgba(15, 23, 42, 0.22)"
                  strokeWidth="1"
                />
                <text
                  x={textPosition.x}
                  y={textPosition.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#050505"
                  fontSize={getLabelFontSize(participant.name, total, maxLabelWidth)}
                  fontWeight="700"
                  transform={`rotate(${getReadableLabelRotation(textAngle)} ${textPosition.x} ${textPosition.y})`}
                >
                  {participant.name}
                </text>
              </g>
            );
          })}
        </g>
        <circle cx="210" cy="210" r="22" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      </svg>
    </WheelShell>
  );
}

function WheelShell({ canSpin, showHint, onSpin, children }: { canSpin: boolean; showHint: boolean; onSpin: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onSpin}
      disabled={!canSpin}
      className="relative mx-auto block aspect-square w-full max-w-[540px] cursor-pointer bg-transparent p-0 text-inherit disabled:cursor-not-allowed"
      aria-label="Dar click para girar"
    >
      {showHint ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 w-[70%] max-w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-950/65 px-6 py-3 text-center text-2xl font-normal text-white shadow-2xl md:text-3xl">
          haz clic para girarlo
        </div>
      ) : null}
      {children}
    </button>
  );
}

function WheelPointer() {
  return (
    <div
      className="absolute right-[8px] top-1/2 z-20 h-0 w-0 -translate-y-1/2 border-y-[17px] border-r-[34px] border-y-transparent border-r-red-600"
      style={{ filter: "drop-shadow(-3px 4px 5px rgba(15, 23, 42, 0.42))" }}
      aria-hidden="true"
    />
  );
}

function getLabelFontSize(label: string, total: number, maxWidth: number): number {
  const baseSize = total <= 8 ? 30 : total > 14 ? 16 : 28;
  const minSize = total <= 8 ? 18 : 12;
  const estimatedCharacterWidth = 0.5;
  const sizeFromLength = Math.floor(maxWidth / (Math.max(label.length, 1) * estimatedCharacterWidth));

  return Math.max(minSize, Math.min(baseSize, sizeFromLength));
}

function getReadableLabelRotation(textAngle: number): number {
  const rotation = (textAngle + 90) % 360;

  if (rotation > 90 && rotation < 270) {
    return rotation - 180;
  }

  return rotation;
}
