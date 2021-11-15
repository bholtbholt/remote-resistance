import { render } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
import RoundTracker from '../components/RoundTracker.svelte';
import {
  createHistoryEvent,
  players,
  roundOneStart,
  roundOneNewVote,
  roundThreeStart,
  votesApproved,
} from './history-states';
const socket = require('socket.io-client')('test');

test('should show all rounds', () => {
  const { container } = render(AppFixture, {
    socket,
    component: RoundTracker,
    historyState: roundOneStart,
  });

  const tracker = container.querySelectorAll('#RoundTracker > li');

  expect(tracker.length).toEqual(5);
});

test('should highlight the current round', () => {
  const { container } = render(AppFixture, {
    socket,
    component: RoundTracker,
    historyState: roundThreeStart,
  });

  const tracker = container.querySelectorAll('#RoundTracker > li');
  const [round1, round2, round3] = tracker;

  expect(round3.classList).toContain('bg-yellow-400');
  expect(round2.classList).not.toContain('bg-yellow-400');
});

test('should show mission status for previous rounds', () => {
  const { container } = render(AppFixture, {
    socket,
    component: RoundTracker,
    historyState: roundThreeStart,
  });

  const tracker = container.querySelectorAll('#RoundTracker > li');
  const [resistanceWin, spyWin, currentRound] = tracker;

  expect(resistanceWin.classList).toContain('bg-sky-400');
  expect(spyWin.classList).toContain('bg-rose-600');
  expect(currentRound.classList).toContain('bg-yellow-400');
});

test('should show failed team votes for the currrent round', () => {
  const { container } = render(AppFixture, {
    socket,
    component: RoundTracker,
    historyState: roundOneNewVote,
  });

  const round1 = container.querySelector('#RoundTracker > li:first-of-type');

  expect(round1.classList).toContain('bg-yellow-400');
  expect(round1.innerHTML).toContain(
    '<div class="text-xs text-indigo-800 dark:text-indigo-50">1</div>',
  );
});

test('should not display failed team votes after PhaseTeamBuilding has passed', () => {
  const [p1, p2, p3, p4, p5, p6, p7] = players;
  const { container } = render(AppFixture, {
    socket,
    component: RoundTracker,
    historyState: [
      ...roundOneNewVote,
      createHistoryEvent('team::selection', p1.id),
      createHistoryEvent('team::selection', p2.id),
      createHistoryEvent('team::confirmation', [p1.id, p2.id]),
      createHistoryEvent('phase::set', 'TEAM_VOTE'),
      ...votesApproved,
      createHistoryEvent('phase::set', 'TEAM_REVEAL'),
      createHistoryEvent('phase::set', 'MISSION_START'),
    ],
  });

  const round1 = container.querySelector('#RoundTracker > li:first-of-type');
  expect(round1.innerHTML).toContain(
    '<span class="absolute inset-0 z-n h-full w-full rounded-full animate-slow-pulse bg-inherit"></span>',
  );
});
