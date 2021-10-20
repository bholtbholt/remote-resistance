import type { Action } from '../types';
import { Server as SocketIO } from 'socket.io';
import { expressServer } from './routes';
import { actionNames } from '../actions';
import { historyEvents, createHistory } from './history';
import * as historyState from '../tests/history-states';
const initHistory = historyState[process.env.HISTORY] || [];

const namespaces = new SocketIO(expressServer).of(/^\/\w+/);
namespaces.on('connection', (socket) => {
  const { nsp: namespace } = socket;
  // Share socket events through history. The app listens for
  // history::init once to replay events for new connections
  historyEvents[namespace.name] = historyEvents[namespace.name] || initHistory;
  namespace.emit('history::init', historyEvents[namespace.name]);

  // Initialize all socket events and use createHistory
  // to store state on the server and emit socket event
  actionNames.forEach((action: Action) => {
    socket.on(action, (data) => {
      createHistory(namespace, action, data);
    });
  });

  console.log('connected');
  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
