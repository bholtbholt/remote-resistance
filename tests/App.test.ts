import { render } from '@testing-library/svelte';
import App from '../components/App.svelte';
import { history } from '../stores/history';
import { appstate } from '../stores/app'; // TODO Remove when real history exists
import { createHistoryEvent, roundOneStart, roundFiveMissionFailed } from './history-states';
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

test('should only init history once', () => {
  jest.spyOn(socket, 'once');
  const { container } = render(App, { socket, currentPlayerIdSessionKey: '' });

  socket.emit('history::init', []);
  socket.emit('history::init', []);
  socket.emit('history::init', []);
  socket.emit('history::init', []);

  expect(socket.once).toHaveBeenCalledTimes(1);
});

test('should reset hideRoleReveal when a new round starts', () => {
  window.sessionStorage.setItem('hideRoleReveal', 'true');
  expect(window.sessionStorage.getItem('hideRoleReveal')).toEqual('true');

  history['history::init']([
    ...roundFiveMissionFailed,
    createHistoryEvent('appstate::reset'),
    createHistoryEvent('missionvote::reset'),
    createHistoryEvent('team::reset'),
    createHistoryEvent('teamvote::reset'),
    createHistoryEvent('phase::set', 'TEAM_SELECTION'),
    createHistoryEvent('rounds::reset'),
  ]);

  expect(window.sessionStorage.getItem('hideRoleReveal')).toBeNull();
});
