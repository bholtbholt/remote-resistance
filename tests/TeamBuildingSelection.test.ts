import 'ts-jest';
import { render, fireEvent } from '@testing-library/svelte';
import { createHistoryEvent, resetTestState } from './test-helper';
import AppFixture from './AppFixture.svelte';
import TeamBuildingSelection from '../components/TeamBuildingSelection.svelte';
import { currentPlayerId } from '../stores/player';
import { team, teamVotes } from '../stores/team';
import { roundOneStart, players } from './history-states';
const socket = require('socket.io-client')('test');

afterEach(() => {
  return resetTestState();
});

describe('when player is leader', () => {
  beforeEach(() => {
    const [leader] = players;
    currentPlayerId.set(leader.id);
    return;
  });

  test('should show team size for round', () => {
    const { getByRole } = render(AppFixture, {
      socket,
      component: TeamBuildingSelection,
      historyState: roundOneStart,
    });

    const h2 = getByRole('heading', {
      name: 'Pick 2 players for the first mission.',
    });
    expect(h2);
  });

  test('should let leader select players', async () => {
    spyOn(socket, 'emit');
    const { container } = render(AppFixture, {
      socket,
      component: TeamBuildingSelection,
      historyState: roundOneStart,
    });

    players.forEach((player) => {
      const input = container.querySelector(`#player_${player.id}:not(disabled)`);
      expect(input);
    });

    const [p1] = players;
    const p1Input = container.querySelector(`#player_${p1.id}`);

    await fireEvent.click(p1Input);

    expect(socket.emit).toHaveBeenCalledWith('team::selection', p1.id);
  });

  test('should let leader confirm a team', async () => {
    spyOn(socket, 'emit');
    const [p1, p2] = players;
    const { getByText } = render(AppFixture, {
      socket,
      component: TeamBuildingSelection,
      historyState: [
        ...roundOneStart,
        createHistoryEvent('team::selection', p1.id),
        createHistoryEvent('team::selection', p2.id),
      ],
    });

    const button = getByText('Confirm this team');

    await fireEvent.click(button);

    expect(socket.emit).toHaveBeenCalledWith('team::confirmation', [p1.id, p2.id]);
    expect(socket.emit).toHaveBeenCalledWith('roundstate::set', 'TEAM_VOTE');
  });
});

describe('when player is not leader', () => {
  test('should disable players', () => {
    const { container } = render(AppFixture, {
      socket,
      component: TeamBuildingSelection,
      historyState: roundOneStart,
    });

    players.forEach((player) => {
      const input = container.querySelector(`#player_${player.id}`);
      expect(input);
      expect(input).toHaveProperty('disabled');
    });
  });

  test('should show other players the leader selection in real-time', () => {
    const [p1, p2] = players;
    const { container } = render(AppFixture, {
      socket,
      component: TeamBuildingSelection,
      historyState: [
        ...roundOneStart,
        createHistoryEvent('team::selection', p1.id),
        createHistoryEvent('team::selection', p2.id),
      ],
    });

    const p1Label = container.querySelector(`label[for="player_${p1.id}"]`);
    const p1Input = container.querySelector(`#player_${p1.id}`);
    expect(p1Label.classList).toContain('outline');
    expect(p1Input).toHaveProperty('disabled');

    const p2Label = container.querySelector(`label[for="player_${p2.id}"]`);
    const p2Input = container.querySelector(`#player_${p2.id}`);
    expect(p2Label.classList).toContain('outline');
    expect(p2Input).toHaveProperty('disabled');
  });
});
