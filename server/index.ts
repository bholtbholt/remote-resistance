import { server } from './routes';
const socketIO = require('socket.io')(server);
const { v4: uuid } = require('uuid');

// Rooms are actually "namespaces" in socket.io for better security
// not to be confused with socket.io "rooms"
const rooms = socketIO.of(/^\/\w+/);
const historyEvents = {};

rooms.on('connection', (socket) => {
  console.log('connected');
  const { nsp: room } = socket;
  historyEvents[room.name] = historyEvents[room.name] || [];

  room.emit('history::init', historyEvents[room.name]);

  socket.on('user::add', (user) => {
    createHistory(room, 'user::add', user);
    room.emit('user::add', user);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

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
