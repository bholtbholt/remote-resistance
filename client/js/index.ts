import { User } from 'types';
import { v4 as uuid } from 'uuid';
const socket = require('socket.io-client')(window.location.pathname);

// Redirect if hitting the parent root
if (window.location.pathname === '/') {
  window.location.pathname = `/${uuid()}`;
}

const form = document.getElementById('form') as HTMLFormElement;
const m = document.getElementById('m') as HTMLInputElement;
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
