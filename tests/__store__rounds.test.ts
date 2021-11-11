import { get } from 'svelte/store';
import { rounds, currentRound, phaseTeamBuilding } from '../stores/round';
import { history } from '../stores/history';
import {
  createHistoryEvent,
  roundOneStart,
  roundOneTeam,
  roundOneTeamApproved,
  roundOneMissionPassed,
} from './history-states';

test('should initialize all rounds', () => {
  history['history::init'](roundOneTeamApproved);
  expect(get(rounds).length).toEqual(5);
});

test('should update the round', () => {
  history['history::init'](roundOneTeamApproved);
  const currentRoundData = get(currentRound);
  const roundIndex = currentRoundData.index;
  const expectedResult = {
    failedTeamVotes: 1,
  };

  rounds['rounds::update']([roundIndex, expectedResult]);
  expect(get(rounds)[roundIndex]).toEqual(expect.objectContaining(expectedResult));
});

describe('#currentRound', () => {
  test('should return the first round', () => {
    history['history::init'](roundOneTeamApproved);
    const round = get(currentRound);

    expect(round).toEqual(get(rounds)[0]);
    expect(round).not.toEqual(get(rounds)[1]);
    expect(round.name).toEqual('first');
  });

  test('should return the fourth round', () => {
    history['history::init']([
      ...roundOneTeamApproved,
      createHistoryEvent('rounds::increment'),
      createHistoryEvent('rounds::increment'),
      createHistoryEvent('rounds::increment'),
    ]);
    const round = get(currentRound);

    expect(round).toEqual(get(rounds)[3]);
    expect(round).not.toEqual(get(rounds)[0]);
    expect(round.name).toEqual('fourth');
  });
});

describe('#phaseTeamBuilding', () => {
  test('should return true when in TEAM_SELECTION phase', () => {
    history['history::init'](roundOneStart);
    const phase = get(phaseTeamBuilding);
    expect(phase).toBeTruthy();
  });

  test('should return true when in TEAM_VOTE phase', () => {
    history['history::init'](roundOneTeam);
    const phase = get(phaseTeamBuilding);
    expect(phase).toBeTruthy();
  });

  test('should return true when in TEAM_REVEAL phase', () => {
    history['history::init'](roundOneTeamApproved);
    const phase = get(phaseTeamBuilding);
    expect(phase).toBeTruthy();
  });

  test('should return false when in MISSION_START phase', () => {
    history['history::init']([
      ...roundOneTeamApproved,
      createHistoryEvent('roundstate::set', 'MISSION_START'),
    ]);
    const phase = get(phaseTeamBuilding);
    expect(phase).toBeFalsy();
  });

  test('should return false when in MISSION_REVEAL phase', () => {
    history['history::init'](roundOneMissionPassed);
    const phase = get(phaseTeamBuilding);
    expect(phase).toBeFalsy();
  });
});
