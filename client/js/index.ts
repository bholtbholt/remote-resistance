import { App, HistoryEvent, Listeners, Player } from 'types';
import { v4 as uuid } from 'uuid';
const socket = require('socket.io-client')(window.location.pathname);

// Redirect if hitting the parent root
if (window.location.pathname === '/') {
  window.location.pathname = `/${uuid()}`;
}

// init/setup
window.historyEvents = [];
window.app = initApp();
const listeners: Listeners = {
  'player::add': appendPlayer,
  'history::add': addHistory,
};

const form = document.getElementById('player-form') as HTMLFormElement;
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const [name, avatar] = ['name', 'avatar'].map((fieldName) => this.elements[fieldName].value);
  const player: Player = {
    id: uuid(),
    name,
    avatar,
  };

  socket.emit('player::add', player);
  this.reset();
  return false;
});

function appendPlayer(player: Player): void {
  const newPlayer = document.createElement('li');
  newPlayer.innerHTML = `${player.avatar} ${player.name}`;
  document.getElementById('players').appendChild(newPlayer);
  window.app.players.push(player);
}

function addHistory(event: HistoryEvent): void {
  window.historyEvents.push(event);
}

function initApp(): App {
  return {
    players: [],
    current_player_id: '',
    url: window.location.href,
  };
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
