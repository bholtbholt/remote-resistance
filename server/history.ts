import { v4 as uuid } from 'uuid';

const historyEvents = {};
function createHistory(room, action, data) {
  const event = {
    action,
    data,
    timestamp: Date.now(),
    id: uuid(),
  };
  historyEvents[room.name].push(event);
  room.emit('history::add', event);
}

export { historyEvents, createHistory };
