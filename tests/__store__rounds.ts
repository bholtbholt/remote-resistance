import { createHistoryEvent } from './test-helper';
import { get } from 'svelte/store';
import { rounds, currentRound } from '../stores/round';
import { history } from '../stores/history';
import { roundOneTeamApproved } from './history-states';

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
    expect(round.winner).toEqual(undefined);
  });

  test('should return the fourth round', () => {
    history['history::init']([
      ...roundOneTeamApproved,
      createHistoryEvent('rounds::update', [0, { winner: 'resistance' }]),
      createHistoryEvent('rounds::update', [1, { winner: 'spies' }]),
      createHistoryEvent('rounds::update', [2, { winner: 'resistance' }]),
    ]);
    const round = get(currentRound);

    expect(round).toEqual(get(rounds)[3]);
    expect(round).not.toEqual(get(rounds)[0]);
    expect(round.name).toEqual('fourth');
    expect(round.winner).toEqual(undefined);
  });
});
