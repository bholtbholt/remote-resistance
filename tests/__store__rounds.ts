import 'ts-jest';
import { createPlayer, repeat } from './test-helper';
import { get } from 'svelte/store';
import { players } from '../stores/player';
import { ruleset, generateRuleset } from '../stores/rules';
import { rounds, currentRound } from '../stores/round';

beforeEach(() => {
  repeat(5, () => {
    players['player::add'](createPlayer());
  });
  const rules = generateRuleset(get(players));
  rounds['rounds::init'](rules);
});

afterEach(() => {
  rounds.set([]);
  ruleset.set({
    playerCount: undefined,
    spyCount: undefined,
    playerIds: [],
    spyIds: [],
    missions: {},
    failTies: undefined,
    roundsToWin: undefined,
    permittedTeamVoteFails: undefined,
  });
  players.set([]);
  return;
});

test('should initialize all rounds', () => {
  expect(get(rounds).length).toEqual(5);
});

test('should return the current round', () => {
  const round = get(currentRound);

  expect(round).toEqual(get(rounds)[0]);
  expect(round).not.toEqual(get(rounds)[1]);
  expect(round.name).toEqual('first');
  expect(round.winner).toEqual(undefined);
});

test('should update the round', () => {
  const currentRoundData = get(currentRound);
  const roundId = currentRoundData.id;
  const expectedResult = {
    failedTeamVotes: 1,
  };

  rounds['rounds::update']([roundId, expectedResult]);
  expect(get(rounds)[roundId]).toEqual(expectedResult);
});
