import { render } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import App from '../components/App.svelte';
import { history } from '../stores/history';
import { appstate } from '../stores/app'; // TODO Remove when real history exists
import { roundOneStart } from './history-states';
const socket = require('socket.io-client')('test');

test('should show a loading state before history inits', () => {
  const { getByTestId } = render(App, { socket, currentPlayerIdSessionKey: '' });

  const component = getByTestId('UISpinner');
  expect(component).toBeInTheDocument();
});

test('should render pre_game component', () => {
  history['history::init']([]);
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  const component = container.querySelector('#AppStatePreGame');
  expect(component).toBeInTheDocument();
});

test('should render in_game component', () => {
  history['history::init'](roundOneStart);
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  const component = container.querySelector('#AppStateInGame');
  expect(component).toBeInTheDocument();
});

test('should render post_game component', () => {
  history['history::init'](roundOneStart);
  appstate['appstate::set']('POST_GAME'); // TODO Remove when real history exists
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  const component = container.querySelector('#AppStatePostGame');
  expect(component).toBeInTheDocument();
});

test('should only init history once', () => {
  jest.spyOn(socket, 'once');
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  socket.emit('history::init', []);
  socket.emit('history::init', []);
  socket.emit('history::init', []);
  socket.emit('history::init', []);

  expect(socket.once).toHaveBeenCalledTimes(1);
});
