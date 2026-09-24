"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { secureRandomInt } from "@/lib/random";
import { getSpinDelta } from "@/lib/wheel";
import { DEFAULT_STATE, loadRouletteState, makeResult, saveRouletteState, UNDEFINED_WINNER_ID } from "@/lib/storage";
import type { Participant, RouletteResult, RouletteSettings, StoredRouletteState } from "@/types/roulette";

export function useRoulette() {
  const [state, setState] = useState<StoredRouletteState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeResult, setActiveResult] = useState<RouletteResult | null>(null);
  const [removingParticipantId, setRemovingParticipantId] = useState<string | null>(null);
  const [showSpinHint, setShowSpinHint] = useState(true);
  const spinTimeoutRef = useRef<number | null>(null);
  const removeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // localStorage is only available after the client mounts.
    const storedState = loadRouletteState();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(storedState);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveRouletteState(state);
    }
  }, [loaded, state]);

  const selectedWinner = useMemo(
    () => state.participants.find((participant) => participant.id === state.settings.configuredWinnerId) ?? null,
    [state.participants, state.settings.configuredWinnerId]
  );

  const updateParticipants = useCallback((names: string) => {
    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    if (removeTimeoutRef.current) {
      window.clearTimeout(removeTimeoutRef.current);
      removeTimeoutRef.current = null;
    }

    setIsSpinning(false);
    setActiveResult(null);
    setRemovingParticipantId(null);
    setShowSpinHint(true);

    setState((current) => {
      return {
        ...current,
        participantInput: names,
        participants: parseActiveParticipants(names),
        configuredWinnerUsed: current.configuredWinnerUsed
      };
    });
  }, []);

  const clearParticipants = useCallback(() => {
    updateParticipants("");
  }, [updateParticipants]);

  const resetParticipants = useCallback(() => {
    updateParticipants(DEFAULT_STATE.participantInput);
    setRotation(0);
  }, [updateParticipants]);

  const updateSettings = useCallback((settings: RouletteSettings) => {
    setState((current) => ({
      ...current,
      settings: resolveSettingsWinner(settings, current.participants),
      configuredWinnerUsed: false
    }));
  }, []);

  const spin = useCallback(() => {
    const activeParticipants = parseActiveParticipants(state.participantInput);

    if (isSpinning || activeParticipants.length < 1) {
      return;
    }

    const configuredWinner =
      activeParticipants.find((participant) => participant.id === state.settings.configuredWinnerId) ??
      activeParticipants.find((participant) => sameName(participant.name, state.settings.configuredWinnerName)) ??
      null;
    const shouldUseConfiguredWinner = state.settings.mode === "configured" && !state.configuredWinnerUsed && configuredWinner;
    const winner = shouldUseConfiguredWinner ? configuredWinner : activeParticipants[secureRandomInt(activeParticipants.length)];
    const winnerIndex = activeParticipants.findIndex((participant) => participant.id === winner.id);
    const spinDelta = getSpinDelta(rotation, winnerIndex, activeParticipants, 5 + secureRandomInt(3));
    const spinDuration = getSafeSpinDuration(state.settings.spinDuration);
    const result = makeResult(winner, state.settings.mode);

    setShowSpinHint(false);
    setIsSpinning(true);
    setActiveResult(null);
    setRemovingParticipantId(null);
    setState((current) => ({
      ...current,
      participants: activeParticipants
    }));
    setRotation((current) => current + spinDelta);

    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
    }

    spinTimeoutRef.current = window.setTimeout(() => {
      setState((current) => ({
        ...current,
        configuredWinnerUsed: current.settings.mode === "configured" ? true : current.configuredWinnerUsed,
        history: [result, ...current.history].slice(0, 20)
      }));
      setActiveResult(result);
      setIsSpinning(false);
      spinTimeoutRef.current = null;
    }, spinDuration * 1000);
  }, [
    isSpinning,
    rotation,
    state.configuredWinnerUsed,
    state.participantInput,
    state.settings.configuredWinnerId,
    state.settings.configuredWinnerName,
    state.settings.mode,
    state.settings.spinDuration
  ]);

  const clearResult = useCallback(() => {
    setRemovingParticipantId(null);
    setActiveResult(null);
  }, []);

  const removeActiveResultParticipant = useCallback(() => {
    if (!activeResult || removingParticipantId) {
      return;
    }

    const participantId = activeResult.participant.id;
    setRemovingParticipantId(participantId);
    const nextParticipantInput = strikeParticipantLine(state.participantInput, activeResult.participant.name);
    setState((current) => ({
      ...current,
      participantInput: nextParticipantInput
    }));

    if (removeTimeoutRef.current) {
      window.clearTimeout(removeTimeoutRef.current);
    }

    removeTimeoutRef.current = window.setTimeout(() => {
      setState((current) => ({
        ...current,
        participantInput: nextParticipantInput,
        participants: current.participants.filter((participant) => participant.id !== participantId)
      }));
      setActiveResult(null);
      setRemovingParticipantId(null);
      removeTimeoutRef.current = null;
    }, 550);
  }, [activeResult, removingParticipantId, state.participantInput]);

  return {
    participants: state.participants,
    participantInput: state.participantInput,
    settings: state.settings,
    history: state.history,
    rotation,
    isSpinning,
    activeResult,
    removingParticipantId,
    showSpinHint,
    selectedWinner,
    spin,
    clearResult,
    removeActiveResultParticipant,
    updateParticipants,
    clearParticipants,
    resetParticipants,
    updateSettings
  };
}

function parseActiveParticipants(names: string): Participant[] {
  return names
    .split("\n")
    .map((name) => name.trim())
    .filter((name) => name && !isStruckText(name))
    .map((name, index) => ({
      id: `participant-${index + 1}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name
    }));
}

function isStruckText(value: string): boolean {
  return value.includes("\u0336");
}

function getSafeSpinDuration(duration: number): number {
  if (!Number.isFinite(duration)) {
    return 6;
  }

  return Math.min(20, Math.max(1, duration));
}

function resolveSettingsWinner(settings: RouletteSettings, participants: Participant[]): RouletteSettings {
  const configuredWinnerName = settings.configuredWinnerName.trim();
  const matchedParticipant = configuredWinnerName
    ? participants.find((participant) => sameName(participant.name, configuredWinnerName))
    : participants.find((participant) => participant.id === settings.configuredWinnerId);

  return {
    ...settings,
    mode: matchedParticipant ? "configured" : settings.mode,
    configuredWinnerId: matchedParticipant?.id ?? UNDEFINED_WINNER_ID,
    configuredWinnerName,
    spinDuration: getSafeSpinDuration(settings.spinDuration)
  };
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

function strikeParticipantLine(value: string, participantName: string): string {
  let replaced = false;

  return value
    .split("\n")
    .map((line) => {
      if (!replaced && line.trim() === participantName) {
        replaced = true;
        return line
          .split("")
          .map((character) => `${character}\u0336`)
          .join("");
      }

      return line;
    })
    .join("\n");
}
