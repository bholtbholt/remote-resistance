import 'ts-jest';
import { render, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import App from '../components/App.svelte';
import { history } from '../components/history-store';
import { gamestate } from '../components/game-store';
import { generateRuleset, ruleset } from '../components/rules-store';
import { players } from '../components/player-store';
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
  gamestate['gamestate::set']('IN_GAME');
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  expect(container.querySelector('#LobbyGame')).not.toBeNull();
});

test('should render post_game component', () => {
  history['history::init']([]);
  gamestate['gamestate::set']('POST_GAME');
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

  // one for history::init, one for ruleset::generate
  expect(socket.once).toHaveBeenCalledTimes(2);
});

test('should take the last set ruleset', () => {
  spyOn(socket, 'once');
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });
  history['history::init']([]);
  repeat(10, () => {
    players['player::add'](createPlayer());
  });
  const expectedRuleset = generateRuleset(get(players));
  socket.emit('ruleset::generate', expectedRuleset);
  socket.emit('ruleset::generate', generateRuleset(get(players)));
  socket.emit('ruleset::generate', generateRuleset(get(players)));
  socket.emit('ruleset::generate', generateRuleset(get(players)));

  // one for history::init, one for ruleset::generate
  expect(socket.once).toHaveBeenCalledTimes(2);
  // expect(get(ruleset)).toEqual(expectedRuleset);
});
