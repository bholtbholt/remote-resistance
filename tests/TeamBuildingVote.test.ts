import 'ts-jest';
import { render, fireEvent } from '@testing-library/svelte';
import { createHistoryEvent, resetTestState } from './test-helper';
import AppFixture from './AppFixture.svelte';
import TeamBuildingVote from '../components/TeamBuildingVote.svelte';
import { currentPlayerId } from '../stores/player';
import { team, teamVotes } from '../stores/team';
import {
  roundOneTeam,
  roundOneVotesApproved,
  roundOneVotesRejected,
  players,
} from './history-states';
const socket = require('socket.io-client')('test');

afterEach(() => {
  return resetTestState();
});

describe('when player is logged in', () => {
  test('should cast a vote', async () => {
    spyOn(socket, 'emit');
    const [player] = players;
    currentPlayerId.set(player.id);
    const { container, getByText } = render(AppFixture, {
      socket,
      component: TeamBuildingVote,
      historyState: roundOneTeam,
    });

    const input = container.querySelector(`#vote-approve`);
    await fireEvent.click(input);

    const button = getByText('Approve this team');
    expect(button);

    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('teamvote::cast', { playerId: player.id, vote: '👍' });
  });

  test('should show a waiting message after voting', () => {
    const [player] = players;
    currentPlayerId.set(player.id);
    const { getByRole } = render(AppFixture, {
      socket,
      component: TeamBuildingVote,
      historyState: [
        ...roundOneTeam,
        createHistoryEvent('teamvote::cast', { playerId: player.id, vote: '👍' }),
      ],
    });

    const h2 = getByRole('heading', { name: 'Waiting for vote results' });
    expect(h2);
  });
});

test('should restrict viewers from voting', () => {
  const { getByRole, container } = render(AppFixture, {
    socket,
    component: TeamBuildingVote,
    historyState: roundOneTeam,
  });

  const h2 = getByRole('heading', { name: 'Waiting for vote results' });
  expect(h2);
  expect(container.querySelector(`#vote-reject`)).toBeNull();
});

describe('when all votes have been cast', () => {
  test('should let leader reveal votes', async () => {
    spyOn(socket, 'emit');
    const [leader] = players;
    currentPlayerId.set(leader.id);
    const { getByText } = render(AppFixture, {
      socket,
      component: TeamBuildingVote,
      historyState: roundOneVotesApproved,
    });

    const button = getByText('Reveal votes');
    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('roundstate::set', 'TEAM_REVEAL');
  });
});

describe('when team is rejected', () => {
  test('should increment failedTeamVotes', async () => {
    spyOn(socket, 'emit');
    const [leader] = players;
    currentPlayerId.set(leader.id);
    const { getByText } = render(AppFixture, {
      socket,
      component: TeamBuildingVote,
      historyState: roundOneVotesRejected,
    });

    const button = getByText('Reveal votes');
    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('rounds::update', [0, { failedTeamVotes: 1 }]);
  });

  test('should change the leader', async () => {
    spyOn(socket, 'emit');
    const [leader] = players;
    currentPlayerId.set(leader.id);
    const { getByText } = render(AppFixture, {
      socket,
      component: TeamBuildingVote,
      historyState: roundOneVotesRejected,
    });

    const button = getByText('Reveal votes');
    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('leader::change', [players, leader.id]);
  });
});
