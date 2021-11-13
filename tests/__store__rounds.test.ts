import { get } from 'svelte/store';
import {
  rounds,
  currentRound,
} from '../stores/round';
import { history } from '../stores/history';
import {
  createHistoryEvent,
  roundOneTeamApproved,
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
