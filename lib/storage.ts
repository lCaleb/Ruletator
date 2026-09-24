import type { Participant, RouletteResult, RouletteSettings, StoredRouletteState } from "@/types/roulette";

const STORAGE_KEY = "ruletator:v1";
export const UNDEFINED_WINNER_ID = "__undefined__";

export const DEFAULT_PARTICIPANTS: Participant[] = Array.from({ length: 12 }, (_, index) => ({
  id: `participant-${index + 1}`,
  name: `${index + 1}`
}));

export const DEFAULT_SETTINGS: RouletteSettings = {
  title: "Ruletator",
  spinDuration: 6,
  mode: "random",
  configuredWinnerId: UNDEFINED_WINNER_ID,
  configuredWinnerName: "",
  sound: true,
  confetti: true
};

export const DEFAULT_STATE: StoredRouletteState = {
  participants: DEFAULT_PARTICIPANTS,
  participantInput: DEFAULT_PARTICIPANTS.map((participant) => participant.name).join("\n"),
  settings: DEFAULT_SETTINGS,
  history: [],
  configuredWinnerUsed: false
};

export function loadRouletteState(): StoredRouletteState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY);
  if (!rawState) {
    return DEFAULT_STATE;
  }

  try {
    const parsed = JSON.parse(rawState) as Partial<StoredRouletteState>;
    const participants = sanitizeParticipants(parsed.participants);
    const settings = sanitizeSettings(parsed.settings);

    return {
      participants,
      participantInput:
        typeof parsed.participantInput === "string"
          ? parsed.participantInput
          : participants.map((participant) => participant.name).join("\n"),
      settings: {
        ...settings,
        configuredWinnerId: UNDEFINED_WINNER_ID
      },
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, 20) : [],
      configuredWinnerUsed: false
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveRouletteState(state: StoredRouletteState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function makeResult(participant: Participant, mode: RouletteSettings["mode"]): RouletteResult {
  return {
    id: `${participant.id}-${Date.now()}`,
    participant,
    createdAt: new Date().toISOString(),
    mode
  };
}

function sanitizeParticipants(participants: unknown): Participant[] {
  if (!Array.isArray(participants)) {
    return DEFAULT_PARTICIPANTS;
  }

  const clean = participants
    .map((participant, index) => {
      if (!participant || typeof participant !== "object") {
        return null;
      }

      const item = participant as Partial<Participant>;
      const name = typeof item.name === "string" ? item.name.trim() : "";

      return name ? { id: item.id || `participant-${index + 1}`, name } : null;
    })
    .filter(Boolean) as Participant[];

  return clean;
}

function sanitizeSettings(settings: unknown): RouletteSettings {
  if (!settings || typeof settings !== "object") {
    return { ...DEFAULT_SETTINGS };
  }

  const candidate = settings as Partial<RouletteSettings>;
  return {
    title: typeof candidate.title === "string" && candidate.title.trim() ? candidate.title.trim() : DEFAULT_SETTINGS.title,
    spinDuration:
      typeof candidate.spinDuration === "number" && candidate.spinDuration >= 1 && candidate.spinDuration <= 20
        ? candidate.spinDuration
        : DEFAULT_SETTINGS.spinDuration,
    mode: candidate.mode === "configured" ? "configured" : "random",
    configuredWinnerId:
      typeof candidate.configuredWinnerId === "string"
        ? candidate.configuredWinnerId
        : DEFAULT_SETTINGS.configuredWinnerId,
    configuredWinnerName: typeof candidate.configuredWinnerName === "string" ? candidate.configuredWinnerName : "",
    sound: candidate.sound !== false,
    confetti: candidate.confetti !== false
  };
}
