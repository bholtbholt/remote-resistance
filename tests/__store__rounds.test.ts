import { get } from 'svelte/store';
import {
  rounds,
  currentRound,
  spiesWin,
  resistanceWin,
  teamBuildingFailure,
} from '../stores/round';
import { history } from '../stores/history';
import {
  players,
  createHistoryEvent,
  roundOneStart,
  roundOneTeamApproved,
  roundOneLastVote,
  votesRejected,
} from './history-states';

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

describe('rounds::init', () => {
  test('should create 5 rounds', () => {
    history['history::init'](roundOneStart);
    expect(get(rounds).length).toEqual(5);
  });

  test('should add names to the rounds', () => {
    history['history::init'](roundOneStart);
    const [round1, round2, round3, round4, round5] = get(rounds);

    expect(round1.name).toEqual('first');
    expect(round2.name).toEqual('second');
    expect(round3.name).toEqual('third');
    expect(round4.name).toEqual('fourth');
    expect(round5.name).toEqual('last');
  });

  test('should add indexes to the rounds', () => {
    history['history::init'](roundOneStart);
    const [round1, round2, round3, round4, round5] = get(rounds);

    expect(round1.index).toEqual(0);
    expect(round2.index).toEqual(1);
    expect(round3.index).toEqual(2);
    expect(round4.index).toEqual(3);
    expect(round5.index).toEqual(4);
  });
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

describe('#spiesWin', () => {
  test('should return true when spies win 3 rounds', () => {
    history['history::init']([
      ...roundOneTeamApproved,
      createHistoryEvent('rounds::update', [0, { winner: 'spies' }]),
      createHistoryEvent('rounds::update', [1, { winner: 'spies' }]),
      createHistoryEvent('rounds::update', [2, { winner: 'spies' }]),
    ]);

    const win = get(spiesWin);
    expect(win).toBeTruthy();
  });

  test('should return false when spies have less than 3 round wins', () => {
    history['history::init']([
      ...roundOneTeamApproved,
      createHistoryEvent('rounds::update', [0, { winner: 'spies' }]),
      createHistoryEvent('rounds::update', [1, { winner: 'spies' }]),
    ]);

    const win = get(spiesWin);
    expect(win).toBeFalsy();
  });
});

describe('#teamBuildingFailure', () => {
  test('should return true when the team has failed to form', () => {
    const [p1, p2] = players;
    history['history::init']([
      ...roundOneLastVote,
      createHistoryEvent('team::selection', p1.id),
      createHistoryEvent('team::selection', p2.id),
      createHistoryEvent('team::confirmation', [p1.id, p2.id]),
      createHistoryEvent('phase::set', 'TEAM_VOTE'),
      ...votesRejected,
      createHistoryEvent('phase::set', 'TEAM_REVEAL'),
      createHistoryEvent('rounds::update', [0, { failedTeamVotes: 5 }]),
    ]);

    const gameOver = get(teamBuildingFailure);
    expect(gameOver).toBeTruthy();
  });

  test('should return false when the team is still forming', () => {
    history['history::init'](roundOneLastVote);

    const gameOver = get(teamBuildingFailure);
    expect(gameOver).toBeFalsy();
  });
});

describe('#resistanceWin', () => {
  test('should return true when resistance win 3 rounds', () => {
    history['history::init']([
      ...roundOneTeamApproved,
      createHistoryEvent('rounds::update', [0, { winner: 'resistance' }]),
      createHistoryEvent('rounds::update', [1, { winner: 'resistance' }]),
      createHistoryEvent('rounds::update', [2, { winner: 'resistance' }]),
    ]);

    const win = get(resistanceWin);
    expect(win).toBeTruthy();
  });

  test('should return false when resistance have less than 3 round wins', () => {
    history['history::init']([
      ...roundOneTeamApproved,
      createHistoryEvent('rounds::update', [0, { winner: 'resistance' }]),
      createHistoryEvent('rounds::update', [1, { winner: 'resistance' }]),
    ]);

    const win = get(resistanceWin);
    expect(win).toBeFalsy();
  });
});
