import { render, fireEvent } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
import PhaseMissionReveal from '../components/PhaseMissionReveal.svelte';
import { currentPlayerId } from '../stores/player';
import { roundOneMissionPassed, players } from './history-states';
const socket = require('socket.io-client')('test');

import { get } from 'svelte/store';
import { rounds, currentRound } from '../stores/round';

test('should let the leader start the new round', async () => {
  jest.spyOn(socket, 'emit');
  const [previousLeader, newLeader] = players;
  currentPlayerId.set(newLeader.id);
  const { queryByText } = render(AppFixture, {
    socket,
    historyState: roundOneMissionPassed,
    component: PhaseMissionReveal,
  });

  const button = queryByText('Start next round');
  await fireEvent.click(button);

  expect(socket.emit).toHaveBeenCalledWith('roundstate::set', 'TEAM_SELECTION');
});

test('should reset the round state', async () => {
  jest.spyOn(socket, 'emit');
  const [previousLeader, newLeader] = players;
  currentPlayerId.set(newLeader.id);
  const { queryByText } = render(AppFixture, {
    socket,
    historyState: roundOneMissionPassed,
    component: PhaseMissionReveal,
  });

  const button = queryByText('Start next round');
  await fireEvent.click(button);

  expect(socket.emit).toHaveBeenCalledWith('missionvote::reset');
  expect(socket.emit).toHaveBeenCalledWith('team::reset');
  expect(socket.emit).toHaveBeenCalledWith('teamvote::reset');
});

test('should increment the round', async () => {
  jest.spyOn(socket, 'emit');
  const [previousLeader, newLeader] = players;
  currentPlayerId.set(newLeader.id);
  const { queryByText } = render(AppFixture, {
    socket,
    historyState: roundOneMissionPassed,
    component: PhaseMissionReveal,
  });

  const button = queryByText('Start next round');
  await fireEvent.click(button);

  expect(socket.emit).toHaveBeenCalledWith('rounds::increment');
});
