import type { Namespace } from 'socket.io';
import type { Action } from '../types';
import { actionNames } from '../actions';
import { getHistory, createHistory } from './history';

function socketConnection(namespaces: Namespace) {
  namespaces.on('connection', (socket) => {
    const { nsp: namespace } = socket;
    // Share socket events through history. The app listens for
    // history::init once to replay events for new connections
    getHistory(namespace).then((history) => {
      namespace.emit('history::init', history);
    });

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
