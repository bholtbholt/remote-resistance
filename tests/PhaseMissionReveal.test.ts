import { render, fireEvent } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
import PhaseMissionReveal from '../components/PhaseMissionReveal.svelte';
import { currentPlayerId } from '../stores/player';
import {
  roundOneMissionFailed,
  roundOneMissionPassed,
  roundFiveMissionFailed,
  roundFiveMissionPassed,
  players,
} from './history-states';
const socket = require('socket.io-client')('test');

import { get } from 'svelte/store';
import { rounds, currentRound } from '../stores/round';

describe('when the round ends', () => {
  test('should show Mission Passed', () => {
    const { queryByText } = render(AppFixture, {
      socket,
      historyState: roundOneMissionPassed,
      component: PhaseMissionReveal,
    });

    expect(queryByText('Mission passed')).toBeInTheDocument();
  });

  test('should show Mission Failed', () => {
    const { queryByText } = render(AppFixture, {
      socket,
      historyState: roundOneMissionFailed,
      component: PhaseMissionReveal,
    });

    expect(queryByText('Mission failed')).toBeInTheDocument();
  });

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

    expect(socket.emit).toHaveBeenCalledWith('phase::set', 'TEAM_SELECTION');
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
});

describe('when spies win', () => {
  test('should show Spies Win', () => {
    const { queryByText } = render(AppFixture, {
      socket,
      historyState: roundFiveMissionFailed,
      component: PhaseMissionReveal,
    });

    expect(queryByText('Spies win')).toBeInTheDocument();
  });

  test('should start a new game', async () => {
    jest.spyOn(socket, 'emit');
    const { queryByText } = render(AppFixture, {
      socket,
      historyState: roundFiveMissionFailed,
      component: PhaseMissionReveal,
    });

    const button = queryByText('Start a new game');
    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('appstate::set', 'PRE_GAME');
    expect(socket.emit).toHaveBeenCalledWith('missionvote::reset');
    expect(socket.emit).toHaveBeenCalledWith('team::reset');
    expect(socket.emit).toHaveBeenCalledWith('teamvote::reset');
    expect(socket.emit).toHaveBeenCalledWith('phase::set', 'TEAM_SELECTION');
    expect(socket.emit).toHaveBeenCalledWith('rounds::reset');
  });
});

describe('when resistance wins', () => {
  test('should show Resistance Wins', () => {
    const { queryByText } = render(AppFixture, {
      socket,
      historyState: roundFiveMissionPassed,
      component: PhaseMissionReveal,
    });

    expect(queryByText('Resistance wins')).toBeInTheDocument();
  });

  test('should start a new game', async () => {
    jest.spyOn(socket, 'emit');
    const { queryByText } = render(AppFixture, {
      socket,
      historyState: roundFiveMissionPassed,
      component: PhaseMissionReveal,
    });

    const button = queryByText('Start a new game');
    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('appstate::set', 'PRE_GAME');
    expect(socket.emit).toHaveBeenCalledWith('missionvote::reset');
    expect(socket.emit).toHaveBeenCalledWith('team::reset');
    expect(socket.emit).toHaveBeenCalledWith('teamvote::reset');
    expect(socket.emit).toHaveBeenCalledWith('phase::set', 'TEAM_SELECTION');
    expect(socket.emit).toHaveBeenCalledWith('rounds::reset');
  });
});
