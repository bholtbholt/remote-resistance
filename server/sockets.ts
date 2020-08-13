import * as socketIO from 'socket.io';
import { server } from './routes';
import { historyEvents, createHistory } from './history';

// Rooms are actually "namespaces" in socket.io for better security
// not to be confused with socket.io "rooms"
const rooms = socketIO(server).of(/^\/\w+/);
rooms.on('connection', (socket) => {
  const { nsp: room } = socket;
  historyEvents[room.name] = historyEvents[room.name] || [];

  room.emit('history::init', historyEvents[room.name]);

  socket.on('user::add', (user) => {
    createHistory(room, 'user::add', user);
    room.emit('user::add', user);
  });
});
