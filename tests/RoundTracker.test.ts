import { render } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
import RoundTracker from '../components/RoundTracker.svelte';
import { roundOneStart, roundOneNewVote } from './history-states';
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
    historyState: roundOneStart,
  });

  const tracker = container.querySelectorAll('#RoundTracker > li');
  const [round1, round2] = tracker;

  expect(round1.classList).toContain('bg-yellow-400');
  expect(round2.classList).not.toContain('bg-yellow-400');
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
    '<div class="text-xs text-indigo-800 dark:text-indigo-50" style="font-size: 0.66em;">1</div>',
  );
});
