import { render, fireEvent } from '@testing-library/svelte';
import AppFixture from './AppFixture.svelte';
import PhaseTeamReveal from '../components/PhaseTeamReveal.svelte';
import { currentPlayerId } from '../stores/player';
import {
  createHistoryEvent,
  roundOneTeamApproved,
  roundOneTeamRejected,
  roundOneLastVote,
  players,
  votesRejected,
} from './history-states';
const socket = require('socket.io-client')('test');

describe('when vote is rejected', () => {
  test('should allow the new leader to re-start the team building phase', async () => {
    jest.spyOn(socket, 'emit');
    const [leader] = players;
    currentPlayerId.set(leader.id);

    const { getByText } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: roundOneTeamRejected,
    });

    const button = getByText('Pick a new team');
    expect(button).toBeInTheDocument();

    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('teamvote::reset');
    expect(socket.emit).toHaveBeenCalledWith('team::reset');
    expect(socket.emit).toHaveBeenCalledWith('phase::set', 'TEAM_SELECTION');
  });

  test('should reveal the new leader', () => {
    const [leader, player] = players;
    currentPlayerId.set(player.id);

    const { getByRole } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: roundOneTeamRejected,
    });

    const h3 = getByRole('heading', {
      name: `${leader.name} is the new leader`,
    });
    expect(h3).toBeInTheDocument();
  });

  test('should reveal player votes', () => {
    const { queryAllByText } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: roundOneTeamRejected,
    });

    expect(queryAllByText('👎').length).toEqual(5);
    expect(queryAllByText('👍').length).toEqual(2);
  });
});

describe('when vote is approved', () => {
  test('should let a team member start the mission phase', async () => {
    jest.spyOn(socket, 'emit');
    const [teamMember] = players;
    currentPlayerId.set(teamMember.id);

    const { getByText } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: roundOneTeamApproved,
    });

    const button = getByText('Start mission');
    expect(button).toBeInTheDocument();

    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('phase::set', 'MISSION_START');
  });

  test('should hide the mission button', () => {
    const [teamMember, player] = players;
    currentPlayerId.set(player.id);

    const { queryByText } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: roundOneTeamApproved,
    });

    const button = queryByText('Start mission');
    expect(button).toBeNull();
  });

  test('should reveal player votes', () => {
    const { queryAllByText } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: roundOneTeamApproved,
    });

    expect(queryAllByText('👍').length).toEqual(4);
    expect(queryAllByText('👎').length).toEqual(3);
  });
});

describe('$leaderName', () => {
  test('should show current leader name when vote is approved', () => {
    const { getByRole } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: roundOneTeamApproved,
    });
    const [leader] = players;

    const h3 = getByRole('heading', {
      name: `Picked by ${leader.name} for the first mission`,
    });

    expect(h3).toBeInTheDocument();
  });

  test('should show previous leader name when vote is rejected', () => {
    const { getByRole } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: roundOneTeamRejected,
    });
    const [leader] = players;

    const h3 = getByRole('heading', {
      name: `Picked by ${leader.name} for the first mission`,
    });

    expect(h3).toBeInTheDocument();
  });
});

describe("when players can't agree on a team", () => {
  test('should show a warning before the last vote', () => {
    const { getByRole } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: roundOneLastVote,
    });

    const h4 = getByRole('heading', {
      name: 'Spies win if the next team is rejected',
    });

    expect(h4).toBeInTheDocument();
  });

  test('should show Spies Win after the last vote fails', () => {
    const [p1, p2] = players;
    const { getByRole, queryByText } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: [
        ...roundOneLastVote,
        createHistoryEvent('team::selection', p1.id),
        createHistoryEvent('team::selection', p2.id),
        createHistoryEvent('team::confirmation', [p1.id, p2.id]),
        createHistoryEvent('phase::set', 'TEAM_VOTE'),
        ...votesRejected,
        createHistoryEvent('phase::set', 'TEAM_REVEAL'),
        createHistoryEvent('rounds::update', [0, { failedTeamVotes: 5 }]),
      ],
    });

    const h2 = getByRole('heading', {
      name: 'Spies win',
    });
    const button = queryByText('Start a new game');

    expect(h2).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('should start a new game', async () => {
    jest.spyOn(socket, 'emit');
    const [p1, p2] = players;
    const { queryByText } = render(AppFixture, {
      socket,
      component: PhaseTeamReveal,
      historyState: [
        ...roundOneLastVote,
        createHistoryEvent('team::selection', p1.id),
        createHistoryEvent('team::selection', p2.id),
        createHistoryEvent('team::confirmation', [p1.id, p2.id]),
        createHistoryEvent('phase::set', 'TEAM_VOTE'),
        ...votesRejected,
        createHistoryEvent('phase::set', 'TEAM_REVEAL'),
        createHistoryEvent('rounds::update', [0, { failedTeamVotes: 5 }]),
      ],
    });

    const button = queryByText('Start a new game');
    expect(button).toBeInTheDocument();

    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('appstate::set', 'PRE_GAME');
    expect(socket.emit).toHaveBeenCalledWith('missionvote::reset');
    expect(socket.emit).toHaveBeenCalledWith('team::reset');
    expect(socket.emit).toHaveBeenCalledWith('teamvote::reset');
    expect(socket.emit).toHaveBeenCalledWith('phase::set', 'TEAM_SELECTION');
    expect(socket.emit).toHaveBeenCalledWith('rounds::reset');
  });
});
