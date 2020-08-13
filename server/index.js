const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { v4: uuid } = require('uuid');

const port = process.env.PORT || 3000;
// Rooms are actually "namespaces" in socket.io for better security
// not to be confused with socket.io "rooms"
const rooms = io.of(/^\/\w+/);
const history = {};

// Default paths render static file and support route parameter for :room_id
app.use(express.static(path.join(process.env.PWD, 'dist')));
app.get('/:room_id', function (req, res, next) {
  return res.sendFile(path.join(process.env.PWD, 'dist', 'index.html'));
});
http.listen(port);

rooms.on('connection', (socket) => {
  console.log('connected');
  const { nsp: room } = socket;
  history[room.name] = history[room.name] || [];

  room.emit('history::init', history[room.name]);

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
  history[room.name].push(event);
  room.emit('history::add', event);
}
