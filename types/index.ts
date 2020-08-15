type UUID = string;
export type PlayerId = UUID;
export type Action = string;

export interface HistoryEvent {
  action: string;
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

}
