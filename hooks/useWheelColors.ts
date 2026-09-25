"use client";

import { useMemo } from "react";
import type { Participant } from "@/types/roulette";

export function useWheelColors(participants: Participant[]): string[] {
  return useMemo(() => participants.map((participant) => getStableWordColor(participant.name)), [participants]);
}

function getStableWordColor(name: string): string {
  const seed = getStableNameSeed(name);
  const hue = (seed * 137.508) % 360;
  const saturation = 76 + (seed % 3) * 5;
  const lightness = 61 + (seed % 2) * 8;

  return `hsl(${hue.toFixed(2)} ${saturation}% ${lightness}%)`;
}

function getStableNameSeed(name: string): number {
  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();

  return normalizedName.split("").reduce((seed, character) => seed * 31 + character.charCodeAt(0), 7);
}
