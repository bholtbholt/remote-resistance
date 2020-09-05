import 'ts-jest';
import { render } from '@testing-library/svelte';
import { resetTestState } from './test-helper';
import App from '../components/App.svelte';
import { history } from '../stores/history';
import { appstate } from '../stores/app'; // TODO Remove when real history exists
import { roundOneStart } from './history-states';
const socket = require('socket.io-client')('test');

afterEach(() => {
  return resetTestState();
});

test('should show a loading state before history inits', () => {
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  const component = container.querySelector('.loading-dots');
  expect(component);
});

test('should render pre_game component', () => {
  history['history::init']([]);
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  const component = container.querySelector('#LobbyPreGame');
  expect(component);
});

test('should render in_game component', () => {
  history['history::init'](roundOneStart);
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  const component = container.querySelector('#LobbyGame');
  expect(component);
});

test('should render post_game component', () => {
  history['history::init'](roundOneStart);
  appstate['appstate::set']('POST_GAME'); // TODO Remove when real history exists
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  const component = container.querySelector('#LobbyPostGame');
  expect(component);
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
