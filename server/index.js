const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// Rooms are actually "namespaces" in socket.io for better security
// not to be confused with socket.io "rooms"
const rooms = io.of(/^\/\w+/);
const port = process.env.PORT || 3000;

// Default paths render static file and support route parameter for :room_id
app.use(express.static(path.join(process.env.PWD, 'dist')));
app.get('/:room_id', function (req, res, next) {
  return res.sendFile(path.join(process.env.PWD, 'dist', 'index.html'));
});

rooms.on('connection', (socket) => {
  const { nsp: room } = socket;
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    room.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
