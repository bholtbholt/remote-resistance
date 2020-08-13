type UUID = string;
type PlayerId = UUID;

export interface HistoryEvent {
  action: string;
  data: any;
  timestamp: number;
  id: UUID;
}

export interface Listeners {
  [key: string]: Function;
}

export interface Player {
  avatar: string;
  name: string;
  id: PlayerId;
}

declare global {
  interface Window {
    historyEvents: HistoryEvent[];
  }
}
