import type { Namespace } from 'socket.io';
import type { Action } from '../types';
import { actionNames } from '../actions';
import { historyEvents, createHistory } from './history';
import * as historyState from '../tests/history-states';
const initHistory = historyState[process.env.HISTORY] || [];

function socketConnection(namespaces: Namespace) {
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

    console.log('[-] socket:connected');
    socket.on('disconnect', () => {
      console.log('[!] socket:disconnected');
    });
  });
}

export { socketConnection };
