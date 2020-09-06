import 'ts-jest';
import { createHistoryEvent, resetTestState } from './test-helper';
import { get } from 'svelte/store';
import { missionIsComplete, missionVotes, missionPassed } from '../stores/mission';
import { history } from '../stores/history';
import { roundOneTeamApproved, players } from './history-states';
import { rounds, currentRound } from '../stores/round';

afterEach(() => {
  return resetTestState();
});

test('should cast a vote', () => {
  const id = 'player-id';
  missionVotes['missionvote::cast']({ playerId: id, vote: 'pass' });

  expect(get(missionVotes).length).toEqual(1);
  expect(get(missionVotes)[0]).toEqual({ playerId: id, vote: 'pass' });
});

describe('#missionIsComplete', () => {
  beforeEach(() => {
    return history['history::init'](roundOneTeamApproved);
  });

  test('should return true when all votes are cast', () => {
    const [p1, p2] = players;
    missionVotes['missionvote::cast']({ playerId: p1.id, vote: 'pass' });
    missionVotes['missionvote::cast']({ playerId: p2.id, vote: 'pass' });

    expect(get(missionIsComplete)).toEqual(true);
  });

  test('should return false when votes are outstanding', () => {
    const [p1] = players;
    missionVotes['missionvote::cast']({ playerId: p1.id, vote: 'pass' });

    expect(get(missionIsComplete)).toEqual(false);
  });
});

describe('when permittedMissionVoteFails is 0', () => {
  beforeEach(() => {
    return history['history::init'](roundOneTeamApproved);
  });

  test('should return true for passing missions', () => {
    const [p1, p2] = players;
    missionVotes['missionvote::cast']({ playerId: p1.id, vote: 'pass' });
    missionVotes['missionvote::cast']({ playerId: p2.id, vote: 'pass' });

    expect(get(missionPassed)).toEqual(true);
  });

  test('should return false for failing missions', () => {
    const [p1, p2] = players;
    missionVotes['missionvote::cast']({ playerId: p1.id, vote: 'pass' });
    missionVotes['missionvote::cast']({ playerId: p2.id, vote: 'fail' });

    expect(get(missionPassed)).toEqual(false);
  });
});

describe('when permittedMissionVoteFails is 1', () => {
  beforeEach(() => {
    history['history::init']([
      ...roundOneTeamApproved,
      createHistoryEvent('rounds::update', [0, { winner: 'resistance' }]),
      createHistoryEvent('rounds::update', [1, { winner: 'spies' }]),
      createHistoryEvent('rounds::update', [2, { winner: 'resistance' }]),
    ]);
  });

  test('should return true for passing missions', () => {
    const [p1, p2, p3, p4] = players;
    missionVotes['missionvote::cast']({ playerId: p1.id, vote: 'pass' });
    missionVotes['missionvote::cast']({ playerId: p2.id, vote: 'pass' });
    missionVotes['missionvote::cast']({ playerId: p3.id, vote: 'pass' });
    missionVotes['missionvote::cast']({ playerId: p4.id, vote: 'fail' });

    expect(get(missionPassed)).toEqual(true);
  });

  test('should return false for failing missions', () => {
    const [p1, p2, p3, p4] = players;
    missionVotes['missionvote::cast']({ playerId: p1.id, vote: 'pass' });
    missionVotes['missionvote::cast']({ playerId: p2.id, vote: 'pass' });
    missionVotes['missionvote::cast']({ playerId: p3.id, vote: 'fail' });
    missionVotes['missionvote::cast']({ playerId: p4.id, vote: 'fail' });

    expect(get(missionPassed)).toEqual(false);
  });
});
