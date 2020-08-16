export type Action = string;
export type PlayerId = UUID;
type UUID = string;

export interface HistoryEvent {
  action: Action;
  data: any;
  timestamp: number;
  id: UUID;
}

export interface Player {
  avatar: string;
  name: string;
  id: PlayerId;
}

export interface Ruleset {
  playerIds: PlayerId[];
  spyIds: PlayerId[];
  playerCount: number;
  spyCount: number;
  missions: Object;
  failVoteTies: boolean;
  roundsToWin: number;
}

}
