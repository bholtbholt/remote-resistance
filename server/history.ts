import type { Namespace } from 'socket.io';
import type { Action, HistoryEvent } from '../types';
import { nanoid } from 'nanoid/non-secure';

const historyEvents = {};
// A wrapper for socket.io emit that stores the event in local memory
// as a HistoryEvent. Used to sync client states and replay events
function createHistory(namespace: Namespace, action: Action, data) {
  const event: HistoryEvent = {
    action,
    data,
    timestamp: Date.now(),
    id: nanoid(),
  };
  historyEvents[namespace.name] = [...historyEvents[namespace.name], event];
  namespace.emit(action, data);
  console.log('HistoryEvent', action, data, namespace.name);
}

export { historyEvents, createHistory };
