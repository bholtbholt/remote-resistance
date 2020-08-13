interface HistoryEvent {
  action: string;
  data: any;
  timestamp: number;
  id: string;
}

interface Listeners {
  [key: string]: Function;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

declare global {
  interface Window {
    historyEvents: HistoryEvent[];
  }
}

export { HistoryEvent, Listeners, User };
