export interface HistoryEvent {
  action: string;
  data: any;
  timestamp: number;
  id: string;
}

export interface Listeners {
  [key: string]: Function;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}

declare global {
  interface Window {
    historyEvents: HistoryEvent[];
  }
}
