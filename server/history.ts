import type { Namespace } from 'socket.io';
import type { HistoryEvent } from 'types';
import { v4 as uuid } from 'uuid';

const historyEvents = {};
function createHistory(room: Namespace, action: string, data) {
  const event: HistoryEvent = {
    action,
    data,
    timestamp: Date.now(),
    id: uuid(),
  };
  historyEvents[room.name].push(event);
}

export { historyEvents, createHistory };
