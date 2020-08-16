import type { Namespace } from 'socket.io';
import type { Action, HistoryEvent } from '../types';
import { v4 as uuid } from 'uuid';

const historyEvents = {};
// A wrapper for socket.io emit that stores the event in local memory
// as a HistoryEvent. Used to sync client states and reply events
function createHistory(room: Namespace, action: Action, data) {
  const event: HistoryEvent = {
    action,
    data,
    timestamp: Date.now(),
    id: uuid(),
  };
  historyEvents[room.name].push(event);
  room.emit(action, data);
  console.log('HistoryEvent', action, data);
}

export { historyEvents, createHistory };
