import 'ts-jest';
import { render, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import App from '../components/App.svelte';
import { history } from '../stores/history';
import { appstate } from '../stores/app';
import { generateRuleset, ruleset } from '../stores/rules';
import { players } from '../stores/player';
import { rounds } from '../stores/round';
import { leader } from '../stores/leader';
import { createHistoryEvent, createPlayer, repeat } from './test-helper';
const socket = require('socket.io-client')('test');

// event emitting isn't working as it should, these
// tests aren't entirely accurate
// history['history::init']([]); should be socket.emit('history::init')

test('should show a loading state before history inits', () => {
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  expect(container.querySelector('.loading-dots')).not.toBeNull();
});

test('should render pre_game component', () => {
  history['history::init']([]);
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  expect(container.querySelector('#LobbyPreGame')).not.toBeNull();
});

test('should render in_game component', () => {
  history['history::init']([]);
  repeat(5, () => {
    players['player::add'](createPlayer());
  });
  const rules = generateRuleset(get(players));
  ruleset['ruleset::generate'](rules);
  rounds['rounds::init'](rules);
  leader['leader::change']([get(players), undefined]);
  appstate['appstate::set']('IN_GAME');
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  expect(container.querySelector('#LobbyGame')).not.toBeNull();
});

test('should render post_game component', () => {
  history['history::init']([]);
  appstate['appstate::set']('POST_GAME');
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  expect(container.querySelector('#LobbyPostGame')).not.toBeNull();
});

test('should only init history once', () => {
  spyOn(socket, 'once');
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  socket.emit('history::init', []);
  socket.emit('history::init', []);
  socket.emit('history::init', []);
  socket.emit('history::init', []);

  expect(socket.once).toHaveBeenCalledTimes(1);
});
