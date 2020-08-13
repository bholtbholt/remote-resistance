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
  'user::add': appendUser,
  'history::add': addHistory,
};

const form = document.getElementById('user-form') as HTMLFormElement;
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const [name, avatar] = ['name', 'avatar'].map((fieldName) => this.elements[fieldName].value);
  const user: User = {
    id: uuid(),
    name,
    avatar,
  };

  socket.emit('user::add', user);
  return false;
});

function appendUser(user: User): void {
  const newUser = document.createElement('li');
  newUser.innerHTML = `${user.avatar} ${user.name}`;
  document.getElementById('users').appendChild(newUser);
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
