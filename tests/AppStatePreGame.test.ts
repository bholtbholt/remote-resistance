import { render, fireEvent } from '@testing-library/svelte';
import { createPlayer, repeat } from './test-helper';
import { get } from 'svelte/store';
import AppFixture from './AppFixture.svelte';
import AppStatePreGame from '../components/AppStatePreGame.svelte';
import { currentPlayerId, players } from '../stores/player';
const socket = require('socket.io-client')('test');

test('should render 10 blank spots with no players', () => {
  const { container } = render(AppFixture, { socket, component: AppStatePreGame });

  expect(container.querySelectorAll('ul > li').length).toEqual(10);
});

test('should render 9 blank spots with with 1 player first', () => {
  players['player::add']({ id: 'id-for-binks', avatar: '🐶', name: 'Binks' });
  const { container } = render(AppFixture, { socket, component: AppStatePreGame });

  const slots = container.querySelectorAll('ul > li');

  expect(slots.length).toEqual(10);
  expect(slots[0].id).toEqual('id-for-binks');
});

test('should suggest a new room when all spots are taken', () => {
  repeat(10, () => {
    players['player::add'](createPlayer());
  });
  const { getByText } = render(AppFixture, { socket, component: AppStatePreGame });

  const link = getByText('start a new game');

  expect(link).toBeInTheDocument();
});

test('should render the player form when spots are available', () => {
  const { getByLabelText } = render(AppFixture, { socket, component: AppStatePreGame });

  const nameField = getByLabelText('Name');

  expect(nameField).toBeInTheDocument();
});

test('should render waiting text when the player is logged in but there are not enough players', () => {
  players['player::add']({ id: 'id-for-binks', avatar: '🐶', name: 'Binks' });
  currentPlayerId.set('id-for-binks');
  const { getByText, getByLabelText, rerender } = render(AppFixture, {
    socket,
    component: AppStatePreGame,
  });

  const waitingMessage = getByText('Waiting for more players to join…');

  expect(waitingMessage).toBeInTheDocument();
});

test('should let players start the game when there are enough', () => {
  repeat(4, () => {
    players['player::add'](createPlayer());
  });
  players['player::add']({ id: 'id-for-binks', avatar: '🐶', name: 'Binks' });
  currentPlayerId.set('id-for-binks');
  const { getByText } = render(AppFixture, { socket, component: AppStatePreGame });

  const button = getByText('Start the game!');

  expect(button).toBeInTheDocument();
});

test('should generate a ruleset when the game is started', async () => {
  const binks = { id: 'id-for-binks', avatar: '🐶', name: 'Binks' };
  players['player::add'](binks);
  currentPlayerId.set(binks.id);

  repeat(4, () => {
    const player = createPlayer();
    players['player::add'](player);
  });

  jest.spyOn(socket, 'emit');
  const { getByText } = render(AppFixture, { socket, component: AppStatePreGame });

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

  jest.spyOn(socket, 'emit');
  const { getByText } = render(AppFixture, { socket, component: AppStatePreGame });

  const button = getByText('Start the game!');

  await fireEvent.click(button);

  expect(socket.emit).toHaveBeenCalledWith('appstate::init');
});

test('should initialize the first team builder leader', async () => {
  const binks = { id: 'id-for-binks', avatar: '🐶', name: 'Binks' };
  players['player::add'](binks);
  currentPlayerId.set(binks.id);

  repeat(4, () => {
    const player = createPlayer();
    players['player::add'](player);
  });

  jest.spyOn(socket, 'emit');
  const { getByText } = render(AppFixture, { socket, component: AppStatePreGame });

  const button = getByText('Start the game!');

  await fireEvent.click(button);

  expect(socket.emit).toHaveBeenCalledWith('leader::init', get(players));
});

test('should initialize rounds', async () => {
  const binks = { id: 'id-for-binks', avatar: '🐶', name: 'Binks' };
  players['player::add'](binks);
  currentPlayerId.set(binks.id);

  repeat(4, () => {
    const player = createPlayer();
    players['player::add'](player);
  });

  jest.spyOn(socket, 'emit');
  const { getByText } = render(AppFixture, { socket, component: AppStatePreGame });

  const button = getByText('Start the game!');

  await fireEvent.click(button);

  expect(socket.emit).toHaveBeenCalledWith('rounds::init', expect.objectContaining({}));
});

test('should allow visitors to change the game code', async () => {
  const { getByText, getByLabelText } = render(AppFixture, { socket, component: AppStatePreGame });

  const link = getByText('Change game');
  await fireEvent.click(link);

  const gameField = getByLabelText('Game code');
  await fireEvent.input(gameField, { target: { value: 'HAHA' } });

  const button = getByText('Join game') as HTMLButtonElement;

  expect(button).toBeInTheDocument();
});
