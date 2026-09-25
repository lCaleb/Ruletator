export type RouletteMode = "random" | "configured";

export type Participant = {
  id: string;
  name: string;
};

export type ConfiguredWinner = {
  id: string;
  name: string;
};

export type RouletteSettings = {
  title: string;
  spinDuration: number;
  mode: RouletteMode;
  configuredWinnerId: string;
  configuredWinnerName: string;
  configuredWinners: ConfiguredWinner[];
  sound: boolean;
  confetti: boolean;
};

export type RouletteResult = {
  id: string;
  participant: Participant;
  createdAt: string;
  mode: RouletteMode;
};

export type StoredRouletteState = {
  participants: Participant[];
  participantInput: string;
  settings: RouletteSettings;
  history: RouletteResult[];
  configuredWinnerUsed: boolean;
  configuredWinnerIndex: number;
};
