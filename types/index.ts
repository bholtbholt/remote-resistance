type UUID = string;
type PlayerId = UUID;

export interface HistoryEvent {
  action: string;
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
