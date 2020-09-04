import 'ts-jest';
import { render, fireEvent } from '@testing-library/svelte';
import { resetTestState } from './test-helper';
import AppFixture from './AppFixture.svelte';
import TeamBuildingReveal from '../components/TeamBuildingReveal.svelte';
import { currentPlayerId } from '../stores/player';
import { team, teamVotes } from '../stores/team';
import { roundOneTeamApproved, roundOneTeamRejected, players } from './history-states';
const socket = require('socket.io-client')('test');

afterEach(() => {
  return resetTestState();
});

describe('when vote is rejected', () => {
  test('should allow the new leader to re-start the team building phase', async () => {
    spyOn(socket, 'emit');
    const [leader] = players;
    currentPlayerId.set(leader.id);

    const { getByText } = render(AppFixture, {
      socket,
      component: TeamBuildingReveal,
      historyState: roundOneTeamRejected,
    });

    const button = getByText('Pick a new team');
    expect(button);

    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('teamvote::reset');
    expect(socket.emit).toHaveBeenCalledWith('team::reset');
    expect(socket.emit).toHaveBeenCalledWith('roundstate::set', 'TEAM_SELECTION');
  });

  test('should reveal the new leader', () => {
    const [leader, player] = players;
    currentPlayerId.set(player.id);

    const { getByRole } = render(AppFixture, {
      socket,
      component: TeamBuildingReveal,
      historyState: roundOneTeamRejected,
    });

    const h3 = getByRole('heading', {
      name: `${leader.name} is the new leader`,
    });
    expect(h3);
  });

  test('should reveal player votes', () => {
    const { queryAllByText } = render(AppFixture, {
      socket,
      component: TeamBuildingReveal,
      historyState: roundOneTeamRejected,
    });

    expect(queryAllByText('👎').length).toEqual(5);
    expect(queryAllByText('👍').length).toEqual(2);
  });
});

describe('when vote is approved', () => {
  test('should let a team member start the mission phase', async () => {
    spyOn(socket, 'emit');
    const [teamMember] = players;
    currentPlayerId.set(teamMember.id);

    const { getByText } = render(AppFixture, {
      socket,
      component: TeamBuildingReveal,
      historyState: roundOneTeamApproved,
    });

    const button = getByText('Start mission');
    expect(button);

    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('roundstate::set', 'MISSION_START');
  });

  test('should hide the mission button', () => {
    const [teamMember, player] = players;
    currentPlayerId.set(player.id);

    const { queryByText } = render(AppFixture, {
      socket,
      component: TeamBuildingReveal,
      historyState: roundOneTeamApproved,
    });

    const button = queryByText('Start mission');
    expect(button).toBeNull();
  });

  test('should reveal player votes', () => {
    const { queryAllByText } = render(AppFixture, {
      socket,
      component: TeamBuildingReveal,
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
      component: TeamBuildingReveal,
      historyState: roundOneTeamApproved,
    });
    const [leader] = players;

    const h3 = getByRole('heading', {
      name: `Picked by ${leader.name} for the first mission`,
    });

    expect(h3);
  });

  test('should show previous leader name when vote is rejected', () => {
    const { getByRole } = render(AppFixture, {
      socket,
      component: TeamBuildingReveal,
      historyState: roundOneTeamRejected,
    });
    const [leader] = players;

    const h3 = getByRole('heading', {
      name: `Picked by ${leader.name} for the first mission`,
    });

    expect(h3);
  });
});
