"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getWheelColor } from "@/lib/wheel";
import type { Participant } from "@/types/roulette";

export function useWheelColors(participants: Participant[]): string[] {
  const colorMapRef = useRef(new Map<number, string>());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return useMemo(() => {
    if (!hydrated) {
      return participants.map((_, index) => getWheelColor(index, participants.length));
    }

    const activeIndexes = new Set(participants.map((_, index) => index));
    const colorMap = colorMapRef.current;
    const existingColors = [...colorMap.values()];

    for (const index of colorMap.keys()) {
      if (!activeIndexes.has(index)) {
        colorMap.delete(index);
      }
    }

    return participants.map((_, index) => {
      const existingColor = colorMap.get(index);

      if (existingColor) {
        return existingColor;
      }

      const color = getRandomWheelColor(existingColors);
      colorMap.set(index, color);
      existingColors.push(color);

      return color;
    });
  }, [hydrated, participants]);
}

function getRandomWheelColor(existingColors: string[]): string {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const hue = Math.floor(Math.random() * 360);

    if (existingColors.every((color) => getHueDistance(hue, getHueFromColor(color)) >= 24)) {
      return makeWheelColor(hue);
    }
  }

  return makeWheelColor(Math.floor(Math.random() * 360));
}

function makeWheelColor(hue: number): string {
  const saturation = 68 + Math.floor(Math.random() * 18);
  const lightness = 58 + Math.floor(Math.random() * 14);

  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function getHueFromColor(color: string): number {
  const match = color.match(/^hsl\((\d+)/);

  return match ? Number(match[1]) : 0;
}

function getHueDistance(left: number, right: number): number {
  const distance = Math.abs(left - right);

  return Math.min(distance, 360 - distance);
}
