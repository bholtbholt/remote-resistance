import 'core-js';
import 'ts-jest';
import { render } from '@testing-library/svelte';
import { resetTestState } from './test-helper';
import AppFixture from './AppFixture.svelte';
import RoundTracker from '../components/RoundTracker.svelte';
import { roundOneStart, roundOneNewVote } from './history-states';
const socket = require('socket.io-client')('test');

afterEach(() => {
  return resetTestState();
});

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
  expect(round1.innerHTML).toContain('<div class="font-bold text-sm text-yellow-800">1</div>');
});
