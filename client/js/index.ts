import { HistoryEvent, Listeners, User } from 'types';
import { v4 as uuid } from 'uuid';
const socket = require('socket.io-client')(window.location.pathname);

// Redirect if hitting the parent root
if (window.location.pathname === '/') {
  window.location.pathname = `/${uuid()}`;
}

// init/setup
window.historyEvents = [];
const listeners: Listeners = {
  'message::add': appendMessage,
  'history::add': addHistory,
};

// Adding a message code
const form = document.getElementById('form') as HTMLFormElement;
const m = document.getElementById('m') as HTMLInputElement;
const messages = document.getElementById('messages');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  socket.emit('message::add', m.value);
  m.value = '';
  return false;
});

function appendMessage(msg: string): void {
  const newMessage = document.createElement('li');
  newMessage.innerHTML = msg;
  messages.appendChild(newMessage);
}

function addHistory(event: HistoryEvent): void {
  window.historyEvents.push(event);
}

// Initialize all socket events
Object.entries(listeners).forEach(([action, fn]) => {
  socket.on(action, fn);
});

// replay socket events
socket.on('history::init', (events: HistoryEvent[]) => {
  if (window.historyEvents.length === events.length) return false;

  window.historyEvents = events;
  window.historyEvents.forEach(({ action, data }) => {
    listeners[action](data);
  });
});
