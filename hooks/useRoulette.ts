"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { secureRandomInt } from "@/lib/random";
import { getSpinDelta } from "@/lib/wheel";
import { DEFAULT_STATE, loadRouletteState, makeResult, saveRouletteState, UNDEFINED_WINNER_ID } from "@/lib/storage";
import type { ConfiguredWinner, Participant, RouletteResult, RouletteSettings, StoredRouletteState } from "@/types/roulette";

type PendingSpin = {
  result: RouletteResult;
  configuredWinnerUsed: boolean;
  endAt: number;
};

export function useRoulette() {
  const [state, setState] = useState<StoredRouletteState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeResult, setActiveResult] = useState<RouletteResult | null>(null);
  const [hiddenResult, setHiddenResult] = useState<RouletteResult | null>(null);
  const [removingParticipantId, setRemovingParticipantId] = useState<string | null>(null);
  const [showSpinHint, setShowSpinHint] = useState(true);
  const spinTimeoutRef = useRef<number | null>(null);
  const removeTimeoutRef = useRef<number | null>(null);
  const pendingSpinRef = useRef<PendingSpin | null>(null);

  const finishPendingSpin = useCallback(() => {
    const pendingSpin = pendingSpinRef.current;

    if (!pendingSpin) {
      return;
    }

    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }

    pendingSpinRef.current = null;
    setState((current) => ({
      ...current,
      configuredWinnerUsed: pendingSpin.configuredWinnerUsed ? true : current.configuredWinnerUsed,
      history: [pendingSpin.result, ...current.history].slice(0, 20)
    }));
    setActiveResult(pendingSpin.result);
    setIsSpinning(false);
  }, []);

  useEffect(() => {
    // localStorage is only available after the client mounts.
    const storedState = loadRouletteState();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(storedState);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      const timeoutId = window.setTimeout(() => saveRouletteState(state), 200);

      return () => window.clearTimeout(timeoutId);
    }
  }, [loaded, state]);

  useEffect(() => {
    function finishExpiredSpin() {
      const pendingSpin = pendingSpinRef.current;

      if (pendingSpin && Date.now() >= pendingSpin.endAt) {
        finishPendingSpin();
      }
    }

    document.addEventListener("visibilitychange", finishExpiredSpin);
    window.addEventListener("focus", finishExpiredSpin);
    window.addEventListener("pageshow", finishExpiredSpin);

    return () => {
      document.removeEventListener("visibilitychange", finishExpiredSpin);
      window.removeEventListener("focus", finishExpiredSpin);
      window.removeEventListener("pageshow", finishExpiredSpin);
    };
  }, [finishPendingSpin]);

  const selectedWinner = useMemo(
    () => {
      const firstWinner = state.settings.configuredWinners[0];

      return firstWinner ? findConfiguredParticipant(firstWinner, state.participants) : null;
    },
    [state.participants, state.settings.configuredWinners]
  );

  const updateParticipants = useCallback((names: string) => {
    const hasPendingSpin = pendingSpinRef.current !== null;

    if (!hasPendingSpin && spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    if (removeTimeoutRef.current) {
      window.clearTimeout(removeTimeoutRef.current);
      removeTimeoutRef.current = null;
    }

    if (!hasPendingSpin) {
      setIsSpinning(false);
      setActiveResult(null);
      setHiddenResult(null);
      setShowSpinHint(true);
    }

    setRemovingParticipantId(null);

    setState((current) => {
      return {
        ...current,
        participantInput: names,
        participants: parseActiveParticipants(names),
        configuredWinnerUsed: current.configuredWinnerUsed,
        configuredWinnerIndex: 0
      };
    });
  }, []);

  const clearParticipants = useCallback(() => {
    updateParticipants("");
  }, [updateParticipants]);

  const resetParticipants = useCallback(() => {
    const nextParticipantInput = removeStrikeThrough(state.participantInput);

    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    if (removeTimeoutRef.current) {
      window.clearTimeout(removeTimeoutRef.current);
      removeTimeoutRef.current = null;
    }

    pendingSpinRef.current = null;
    setIsSpinning(false);
    setActiveResult(null);
    setHiddenResult(null);
    setRemovingParticipantId(null);
    setShowSpinHint(true);
    setState((current) => ({
      ...current,
      participantInput: nextParticipantInput,
      participants: parseActiveParticipants(nextParticipantInput),
      configuredWinnerUsed: false,
      configuredWinnerIndex: 0
    }));
    setRotation(0);
  }, [state.participantInput]);

  const resetParticipantsConfiguration = useCallback(() => {
    const nextParticipantInput = removeStrikeThrough(state.participantInput);

    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    if (removeTimeoutRef.current) {
      window.clearTimeout(removeTimeoutRef.current);
      removeTimeoutRef.current = null;
    }

    pendingSpinRef.current = null;
    setIsSpinning(false);
    setActiveResult(null);
    setHiddenResult(null);
    setRemovingParticipantId(null);
    setShowSpinHint(true);
    setState((current) => ({
      ...current,
      participantInput: nextParticipantInput,
      participants: parseActiveParticipants(nextParticipantInput),
      settings: {
        ...current.settings,
        mode: "random",
        configuredWinnerId: UNDEFINED_WINNER_ID,
        configuredWinnerName: "",
        configuredWinners: []
      },
      configuredWinnerUsed: false,
      configuredWinnerIndex: 0
    }));
    setRotation(0);
  }, [state.participantInput]);

  const updateSettings = useCallback((settings: RouletteSettings) => {
    setState((current) => ({
      ...current,
      settings: resolveSettingsWinner(settings, current.participants),
      configuredWinnerUsed: false,
      configuredWinnerIndex: 0
    }));
  }, []);

  const spin = useCallback(() => {
    const activeParticipants = parseActiveParticipants(state.participantInput);

    if (isSpinning || activeParticipants.length < 1) {
      return;
    }

    const configuredWinnerResult =
      state.settings.mode === "configured" && state.settings.configuredWinners.length > 0
        ? findNextConfiguredParticipant(state.settings.configuredWinners, activeParticipants, state.configuredWinnerIndex)
        : null;

    const shouldUseConfiguredWinner = configuredWinnerResult !== null;
    const winner = configuredWinnerResult?.participant ?? activeParticipants[secureRandomInt(activeParticipants.length)];
    const winnerIndex = activeParticipants.findIndex((participant) => participant.id === winner.id);
    const spinDelta = getSpinDelta(
      rotation,
      winnerIndex,
      activeParticipants,
      5 + secureRandomInt(3),
      getRandomTargetAngleOffset(activeParticipants.length)
    );
    const spinDuration = getSafeSpinDuration(state.settings.spinDuration);
    const result = makeResult(winner, shouldUseConfiguredWinner ? "configured" : "random");
    const pendingSpin: PendingSpin = {
      result,
      configuredWinnerUsed: shouldUseConfiguredWinner,
      endAt: Date.now() + spinDuration * 1000
    };

    setShowSpinHint(false);
    setIsSpinning(true);
    setActiveResult(null);
    setHiddenResult(null);
    setRemovingParticipantId(null);
    setState((current) => ({
      ...current,
      participants: activeParticipants
    }));
    setRotation((current) => current + spinDelta);

    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
    }

    pendingSpinRef.current = pendingSpin;
    spinTimeoutRef.current = window.setTimeout(finishPendingSpin, spinDuration * 1000);
  }, [
    finishPendingSpin,
    isSpinning,
    rotation,
    state.configuredWinnerIndex,
    state.participantInput,
    state.settings.configuredWinners,
    state.settings.mode,
    state.settings.spinDuration
  ]);

  const clearResult = useCallback(() => {
    setRemovingParticipantId(null);
    setActiveResult(null);
    setHiddenResult(null);
  }, []);

  const removeActiveResultParticipant = useCallback(() => {
    if (!activeResult || removingParticipantId) {
      return;
    }

    const participantId = activeResult.participant.id;
    const nextConfiguredWinnerIndex =
      activeResult.mode === "configured"
        ? getNextConfiguredWinnerIndex(state.settings.configuredWinners, activeResult.participant.name, state.configuredWinnerIndex)
        : state.configuredWinnerIndex;
    setRemovingParticipantId(participantId);
    const nextParticipantInput = strikeParticipantLine(state.participantInput, activeResult.participant.name);
    setState((current) => ({
      ...current,
      participantInput: nextParticipantInput,
      configuredWinnerIndex: nextConfiguredWinnerIndex
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
      setHiddenResult(activeResult);
      setActiveResult(null);
      setRemovingParticipantId(null);
      removeTimeoutRef.current = null;
    }, 550);
  }, [activeResult, removingParticipantId, state.configuredWinnerIndex, state.participantInput, state.settings.configuredWinners]);

  return {
    participants: state.participants,
    participantInput: state.participantInput,
    settings: state.settings,
    history: state.history,
    rotation,
    isSpinning,
    activeResult,
    hiddenResult,
    removingParticipantId,
    showSpinHint,
    selectedWinner,
    spin,
    clearResult,
    removeActiveResultParticipant,
    updateParticipants,
    clearParticipants,
    resetParticipants,
    resetParticipantsConfiguration,
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
  const trimmed = value.trim();

  return value.includes("\u0336") || (trimmed.startsWith("~~") && trimmed.endsWith("~~"));
}

function removeStrikeThrough(value: string): string {
  return value
    .split("\n")
    .map((line) => {
      const withoutCombiningStrike = line.replace(/\u0336/g, "");

      return withoutCombiningStrike.replace(/^(\s*)~~(.*)~~(\s*)$/, "$1$2$3");
    })
    .join("\n");
}

function getSafeSpinDuration(duration: number): number {
  if (!Number.isFinite(duration)) {
    return 6;
  }

  return Math.min(20, Math.max(1, duration));
}

function getRandomTargetAngleOffset(totalParticipants: number): number {
  const sectorAngle = 360 / totalParticipants;
  const edgeGuard = Math.max(2, Math.min(5, sectorAngle * 0.12));
  const safeRange = Math.max(0, sectorAngle - edgeGuard * 2);
  const steps = 1000;
  const randomRatio = secureRandomInt(steps + 1) / steps;

  return (randomRatio - 0.5) * safeRange;
}

function resolveSettingsWinner(settings: RouletteSettings, participants: Participant[]): RouletteSettings {
  const configuredWinners = settings.configuredWinners
    .map((winner) => resolveConfiguredWinner(winner, participants))
    .filter((winner) => winner.id !== UNDEFINED_WINNER_ID || winner.name);
  const firstWinner = configuredWinners[0] ?? { id: UNDEFINED_WINNER_ID, name: "" };

  return {
    ...settings,
    mode: settings.mode,
    configuredWinnerId: firstWinner.id,
    configuredWinnerName: firstWinner.name,
    configuredWinners,
    spinDuration: getSafeSpinDuration(settings.spinDuration)
  };
}

function resolveConfiguredWinner(winner: ConfiguredWinner, participants: Participant[]): ConfiguredWinner {
  const configuredWinnerName = winner.name.trim();
  const matchedParticipant = configuredWinnerName
    ? participants.find((participant) => sameName(participant.name, configuredWinnerName))
    : participants.find((participant) => participant.id === winner.id);

  return {
    id: matchedParticipant?.id ?? winner.id,
    name: configuredWinnerName || matchedParticipant?.name || ""
  };
}

function findConfiguredParticipant(winner: ConfiguredWinner, participants: Participant[]): Participant | null {
  return (
    participants.find((participant) => sameName(participant.name, winner.name)) ??
    participants.find((participant) => participant.id === winner.id) ??
    null
  );
}

function findNextConfiguredParticipant(
  winners: ConfiguredWinner[],
  participants: Participant[],
  startIndex: number
): { participant: Participant; nextIndex: number } | null {
  for (let index = startIndex; index < winners.length; index += 1) {
    const participant = findConfiguredParticipant(winners[index], participants);

    if (participant) {
      return {
        participant,
        nextIndex: index + 1
      };
    }
  }

  return null;
}

function getNextConfiguredWinnerIndex(winners: ConfiguredWinner[], participantName: string, startIndex: number): number {
  for (let index = startIndex; index < winners.length; index += 1) {
    if (sameName(winners[index].name, participantName)) {
      return index + 1;
    }
  }

  return startIndex;
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
      if (!replaced && !isStruckText(line) && removeStrikeThrough(line).trim() === participantName) {
        replaced = true;
        return `~~${removeStrikeThrough(line).trim()}~~`;
      }

      return line;
    })
    .join("\n");
}
