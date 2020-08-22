import 'ts-jest';
import { render, fireEvent } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
import LobbyPreGame from '../components/LobbyPreGame.svelte';
import { currentPlayerId, players } from '../components/player-store';
import { generateRuleset, ruleset } from '../components/rules-store';
import { createPlayer, repeat } from './test-helper';
const socket = require('socket.io-client')('test');

afterEach(() => {
  return players.set([]);
});

afterEach(() => {
  return currentPlayerId.set('');
});

test('should render 10 blank spots with no players', () => {
  const { container } = render(AppFixture, { socket, component: LobbyPreGame });

  expect(container.querySelectorAll('ul > li').length).toEqual(10);
});

test('should render 9 blank spots with with 1 player first', () => {
  players['player::add']({ id: 'id-for-binks', avatar: '🐶', name: 'Binks' });
  const { container } = render(AppFixture, { socket, component: LobbyPreGame });

  const slots = container.querySelectorAll('ul > li');

  expect(slots.length).toEqual(10);
  expect(slots[0].id).toEqual('id-for-binks');
});

test('should suggest a new room when all spots are taken', () => {
  repeat(10, () => {
    players['player::add'](createPlayer());
  });
  const { getByText } = render(AppFixture, { socket, component: LobbyPreGame });

  const link = getByText('start a new one instead.');

  expect(link);
});

test('should render the player form when spots are available', () => {
  const { getByLabelText } = render(AppFixture, { socket, component: LobbyPreGame });

  const nameField = getByLabelText('Name:');

  expect(nameField);
});

test('should render waiting text when the player is logged in but there are not enough players', () => {
  players['player::add']({ id: 'id-for-binks', avatar: '🐶', name: 'Binks' });
  currentPlayerId.set('id-for-binks');
  const { getByText, getByLabelText, rerender } = render(AppFixture, {
    socket,
    component: LobbyPreGame,
  });

  const waitingMessage = getByText('Waiting for more players to join…');

  expect(waitingMessage);
});

test('should let players start the game when there are enough', () => {
  repeat(4, () => {
    players['player::add'](createPlayer());
  });
  players['player::add']({ id: 'id-for-binks', avatar: '🐶', name: 'Binks' });
  currentPlayerId.set('id-for-binks');
  const { getByText } = render(AppFixture, { socket, component: LobbyPreGame });

  const button = getByText('Start the game!');

  expect(button);
});

test('should generate a ruleset when the game is started', async () => {
  const binks = { id: 'id-for-binks', avatar: '🐶', name: 'Binks' };
  players['player::add'](binks);
  currentPlayerId.set(binks.id);

  repeat(4, () => {
    const player = createPlayer();
    players['player::add'](player);
  });

  spyOn(socket, 'emit');
  const { getByText } = render(AppFixture, { socket, component: LobbyPreGame });

  const button = getByText('Start the game!');

  await fireEvent.click(button);

  expect(socket.emit).toHaveBeenCalledWith('ruleset::generate', expect.objectContaining({}));
});

test('should set the game state to IN_GAME', async () => {
  const binks = { id: 'id-for-binks', avatar: '🐶', name: 'Binks' };
  players['player::add'](binks);
  currentPlayerId.set(binks.id);

  repeat(4, () => {
    const player = createPlayer();
    players['player::add'](player);
  });

  spyOn(socket, 'emit');
  const { getByText } = render(AppFixture, { socket, component: LobbyPreGame });

  const button = getByText('Start the game!');

  await fireEvent.click(button);

  expect(socket.emit).toHaveBeenCalledWith('gamestate::set', 'IN_GAME');
});