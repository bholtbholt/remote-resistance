import 'core-js';
import 'ts-jest';
import { render, fireEvent } from '@testing-library/svelte';
import { createHistoryEvent, resetTestState } from './test-helper';
import AppFixture from './AppFixture.svelte';
import Mission from '../components/Mission.svelte';
import { currentPlayerId } from '../stores/player';
import { roundOneTeamApproved, players } from './history-states';
const socket = require('socket.io-client')('test');

const historyState = [
  ...roundOneTeamApproved,
  createHistoryEvent('roundstate::set', 'MISSION_START'),
];

afterEach(() => {
  return resetTestState();
});

describe('when player is a team member', () => {
  test('should cast a passing vote', async () => {
    jest.spyOn(socket, 'emit');
    const [player] = players;
    currentPlayerId.set(player.id);
    const { getByText, getByRole } = render(AppFixture, {
      socket,
      historyState,
      component: Mission,
    });

    const input = getByRole('radio', { name: 'Pass' }) as HTMLInputElement;
    await fireEvent.click(input);

    const button = getByText('Pass this mission');
    expect(button);

    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('missionvote::cast', {
      playerId: player.id,
      vote: 'pass',
    });
  });

  test('should cast a failing vote', async () => {
    jest.spyOn(socket, 'emit');
    const [player] = players;
    currentPlayerId.set(player.id);
    const { getByText, getByRole } = render(AppFixture, {
      socket,
      historyState,
      component: Mission,
    });

    const input = getByRole('radio', { name: 'Fail' }) as HTMLInputElement;
    await fireEvent.click(input);

    const button = getByText('Fail this mission');
    expect(button);

    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('missionvote::cast', {
      playerId: player.id,
      vote: 'fail',
    });
  });

  test('should prevent resistance from failing votes', () => {
    const [spy1, spy2, spy3, p4, p5, p6] = players;
    currentPlayerId.set(p6.id);
    const { getByRole } = render(AppFixture, {
      socket,
      historyState,
      component: Mission,
    });

    const input = getByRole('radio', { name: 'Fail' }) as HTMLInputElement;
    expect(input.disabled).toEqual(true);
  });

  test('should a waiting message after voting', () => {
    const [player] = players;
    currentPlayerId.set(player.id);
    const { getByRole } = render(AppFixture, {
      socket,
      component: Mission,
      historyState: [
        ...historyState,
        createHistoryEvent('missionvote::cast', {
          playerId: player.id,
          vote: 'fail',
        }),
      ],
    });

    const h2 = getByRole('heading', { name: 'Waiting for mission results' });
    expect(h2);
  });

  test('should not show a waiting message before voting', () => {
    const [player] = players;
    currentPlayerId.set(player.id);
    const { queryByText } = render(AppFixture, {
      socket,
      historyState,
      component: Mission,
    });

    const waitingMessage = queryByText('Waiting for mission results');
    expect(waitingMessage).toBeNull();
  });
});

test('should restrict non-team members from voting', () => {
  const { getByRole, container } = render(AppFixture, {
    socket,
    historyState,
    component: Mission,
  });

  const h2 = getByRole('heading', { name: 'Waiting for mission results' });
  expect(h2);
  expect(container.querySelector(`#vote-pass`)).toBeNull();
});

describe('when mission is complete', () => {
  test('should let the leader reveal the vote', () => {
    const [player, spy2, spy3, p4, p5, p6] = players;
    currentPlayerId.set(player.id);
    const { queryByText } = render(AppFixture, {
      socket,
      component: Mission,
      historyState: [
        ...historyState,
        createHistoryEvent('missionvote::cast', {
          playerId: player.id,
          vote: 'fail',
        }),
        createHistoryEvent('missionvote::cast', {
          playerId: p6.id,
          vote: 'pass',
        }),
      ],
    });

    const message = queryByText('The mission is complete!');
    expect(message);
  });

  test('should not show the reveal message', () => {
    const [player, spy2, spy3, p4, p5, p6] = players;
    currentPlayerId.set(spy2.id);
    const { queryByText } = render(AppFixture, {
      socket,
      component: Mission,
      historyState: [
        ...historyState,
        createHistoryEvent('missionvote::cast', {
          playerId: player.id,
          vote: 'fail',
        }),
        createHistoryEvent('missionvote::cast', {
          playerId: p6.id,
          vote: 'pass',
        }),
      ],
    });

    const message = queryByText('The mission is complete!');
    expect(message).toBeNull();
  });
});

describe('when mission is revealed', () => {
  test('should save the round data', async () => {
    jest.spyOn(socket, 'emit');
    const [player, spy2, spy3, p4, p5, p6] = players;
    currentPlayerId.set(player.id);
    const { queryByText } = render(AppFixture, {
      socket,
      component: Mission,
      historyState: [
        ...historyState,
        createHistoryEvent('missionvote::cast', {
          playerId: player.id,
          vote: 'pass',
        }),
        createHistoryEvent('missionvote::cast', {
          playerId: p6.id,
          vote: 'pass',
        }),
      ],
    });

    const button = queryByText('Reveal results');
    await fireEvent.click(button);

    const expectedUpdate = {
      missionPhase: {
        team: [player.id, p6.id],
        votes: [
          { playerId: player.id, vote: 'pass' },
          { playerId: p6.id, vote: 'pass' },
        ],
        result: 'successful',
      },
    };

    expect(socket.emit).toHaveBeenCalledWith('rounds::update', [0, expectedUpdate]);
  });

  test('should change the leader', async () => {
    jest.spyOn(socket, 'emit');
    const [player, spy2, spy3, p4, p5, p6] = players;
    currentPlayerId.set(player.id);
    const { queryByText } = render(AppFixture, {
      socket,
      component: Mission,
      historyState: [
        ...historyState,
        createHistoryEvent('missionvote::cast', {
          playerId: player.id,
          vote: 'pass',
        }),
        createHistoryEvent('missionvote::cast', {
          playerId: p6.id,
          vote: 'pass',
        }),
      ],
    });

    const button = queryByText('Reveal results');
    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('leader::change', [players, player.id]);
  });

  test('should change the round state', async () => {
    jest.spyOn(socket, 'emit');
    const [player, spy2, spy3, p4, p5, p6] = players;
    currentPlayerId.set(player.id);
    const { queryByText } = render(AppFixture, {
      socket,
      component: Mission,
      historyState: [
        ...historyState,
        createHistoryEvent('missionvote::cast', {
          playerId: player.id,
          vote: 'pass',
        }),
        createHistoryEvent('missionvote::cast', {
          playerId: p6.id,
          vote: 'pass',
        }),
      ],
    });

    const button = queryByText('Reveal results');
    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('roundstate::set', 'MISSION_REVEAL');
  });
});
