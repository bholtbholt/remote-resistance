import { HistoryEvent } from '../client/js/types';
import * as socketIO from 'socket.io';
import { v4 as uuid } from 'uuid';

const historyEvents = {};
function createHistory(room: socketIO.Namespace, action: string, data) {
  const event: HistoryEvent = {
    action,
    data,
    timestamp: Date.now(),
    id: uuid(),
  };
  historyEvents[room.name].push(event);
  room.emit('history::add', event);
}

export { historyEvents, createHistory };
