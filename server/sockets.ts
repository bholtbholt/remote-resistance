import type { Action } from '../types';
import { Server as SocketIO } from 'socket.io';
import { server } from './routes';
import { actionNames } from '../actions';
import { historyEvents, createHistory } from './history';
import * as historyState from '../tests/history-states';
const initHistory = historyState[process.env.HISTORY] || [];

// Rooms are actually "namespaces" in socket.io for better security
// not to be confused with socket.io "rooms"
const rooms = new SocketIO(server).of(/^\/\w+/);
rooms.on('connection', (socket) => {
  const { nsp: room } = socket;
  // Share socket events through history. The app listens for
  // history::init once to replay events for new connections
  historyEvents[room.name] = historyEvents[room.name] || initHistory;
  room.emit('history::init', historyEvents[room.name]);

  // Initialize all socket events and use createHistory
  // to store state on the server and emit socket event
  actionNames.forEach((action: Action) => {
    socket.on(action, (data) => {
      createHistory(room, action, data);
    });
  });

  console.log('connected');
  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
