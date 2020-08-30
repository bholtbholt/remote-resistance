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
});

afterEach(() => {
  return players.set([]);
});

afterEach(() => {
  return rounds.set([]);
});

afterEach(() => {
  return ruleset.set({
    playerCount: undefined,
    spyCount: undefined,
    playerIds: [],
    spyIds: [],
    missions: {},
    failTies: undefined,
    roundsToWin: undefined,
    permittedTeamVoteFails: undefined,
  });
});

test('should initialize all rounds', () => {
  const rules = generateRuleset(get(players));
  rounds['rounds::init'](rules);

  expect(get(rounds).length).toEqual(5);
});

test('should return the current round', () => {
  const rules = generateRuleset(get(players));
  rounds['rounds::init'](rules);
  const round = get(currentRound);

  expect(round).toEqual(get(rounds)[0]);
  expect(round).not.toEqual(get(rounds)[1]);
  expect(round.name).toEqual('first');
  expect(round.winner).toEqual(undefined);
});
