import type { Action } from 'types';
import * as socketIO from 'socket.io';
import { server } from './routes';
import { historyEvents, createHistory } from './history';
import { createPlayer, createHistoryEvent } from '../client/js/__tests__/test-helper';

const actionNames: Action[] = ['player::add', 'ruleset::generate'];
// Rooms are actually "namespaces" in socket.io for better security
// not to be confused with socket.io "rooms"
const rooms = socketIO(server).of(/^\/\w+/);
rooms.on('connection', (socket) => {
  const { nsp: room } = socket;
  // Share socket events through history. The app listens for
  // history::init once to replay events for new connections
  const fourPlayersAddedHistory = [
    createHistoryEvent('player::add', createPlayer()),
    createHistoryEvent('player::add', createPlayer()),
    createHistoryEvent('player::add', createPlayer()),
    createHistoryEvent('player::add', createPlayer()),
  ];
  historyEvents[room.name] = historyEvents[room.name] || fourPlayersAddedHistory; // TODO: Remove
  // historyEvents[room.name] = historyEvents[room.name] || [];
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
