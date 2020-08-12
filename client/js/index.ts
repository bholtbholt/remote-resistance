import { User } from 'types';
import { v4 as uuid } from 'uuid';
const socket = require('socket.io-client')();

// Redirect if hitting the parent root
if (window.location.pathname === '/') {
  window.location.pathname = `/${uuid()}`;
}

// (() => {
//   const ws = new WebSocket(`ws://localhost:8082`);
//   const button = document.getElementById('increment');
//   let count = 0;

//   ws.addEventListener('open', () => {
//     console.log('we are connected');

//     ws.send('hey hows it going?');
//   });

//   ws.addEventListener('message', (event) => {
//     console.log(event);
//   });

//   button.addEventListener('click', () => {
//     ws.send(JSON.stringify({ count: count++ }));
//   });
// })();

const form = document.getElementById('form');
const m = document.getElementById('m');
const messages = document.getElementById('messages');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  socket.emit('chat message', m.value);
  m.value = '';
  return false;
});

socket.on('chat message', function (msg) {
  const newMessage = document.createElement('li');
  newMessage.innerHTML = msg;
  messages.appendChild(newMessage);
});
