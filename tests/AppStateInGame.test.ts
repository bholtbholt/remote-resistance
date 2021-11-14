import { render } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
import AppStateInGame from '../components/AppStateInGame.svelte';
import { currentPlayerId } from '../stores/player';
import {
  createHistoryEvent,
  roundOneStart,
  roundOneTeam,
  roundOneTeamApproved,
  roundOneMissionPassed,
  players,
} from './history-states';
const socket = require('socket.io-client')('test');

describe('when player is logged in', () => {
  test('should show role', () => {
    const [spy1, spy2, spy3, player] = players;
    currentPlayerId.set(player.id);

    const { getByRole } = render(AppFixture, {
      socket,
      component: AppStateInGame,
      historyState: roundOneStart,
    });

    const h2 = getByRole('heading', {
      name: "You're part of the resistance , but there are 3 spies in your midst.",
    });
    expect(h2).toBeInTheDocument();
  });
});

test('should render PhaseTeamSelection', () => {
  const { container } = render(AppFixture, {
    socket,
    component: AppStateInGame,
    historyState: roundOneStart,
  });

  const component = container.querySelector('#PhaseTeamSelection');
  expect(component).toBeInTheDocument();
});

test('should render PhaseTeamVote', () => {
  const { container } = render(AppFixture, {
    socket,
    component: AppStateInGame,
    historyState: roundOneTeam,
  });

  const component = container.querySelector('#PhaseTeamVote');
  expect(component).toBeInTheDocument();
});

test('should render PhaseTeamReveal', () => {
  const { container } = render(AppFixture, {
    socket,
    component: AppStateInGame,
    historyState: roundOneTeamApproved,
  });

  const component = container.querySelector('#PhaseTeamReveal');
  expect(component).toBeInTheDocument();
});

test('should render PhaseMission', () => {
  const { container } = render(AppFixture, {
    socket,
    component: AppStateInGame,
    historyState: [...roundOneTeamApproved, createHistoryEvent('phase::set', 'MISSION_START')],
  });

  const component = container.querySelector('#PhaseMission');
  expect(component).toBeInTheDocument();
});

test('should render PhaseMissionReveal', () => {
  const { container } = render(AppFixture, {
    socket,
    component: AppStateInGame,
    historyState: roundOneMissionPassed,
  });

  const component = container.querySelector('#PhaseMissionReveal');
  expect(component).toBeInTheDocument();
});
