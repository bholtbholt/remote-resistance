import 'ts-jest';
import { createPlayer, repeat } from './test-helper';
import { get } from 'svelte/store';
import { gamestate, preGame, inGame, postGame, spies } from '../stores/game';
import { players } from '../stores/player';
import { ruleset, generateRuleset } from '../stores/rules';

afterEach(() => {
  return gamestate.set('PRE_GAME');
});

afterEach(() => {
  return players.set([]);
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

describe('#gamestate', () => {
  test('should return true when PRE_GAME', () => {
    expect(get(gamestate)).toEqual('PRE_GAME');
    expect(get(preGame)).toEqual(true);
    expect(get(inGame)).toEqual(false);
    expect(get(postGame)).toEqual(false);
  });

  test('should return true when IN_GAME', () => {
    gamestate.set('IN_GAME');
    expect(get(gamestate)).toEqual('IN_GAME');
    expect(get(inGame)).toEqual(true);
    expect(get(preGame)).toEqual(false);
    expect(get(postGame)).toEqual(false);
  });

  test('should return true when POST_GAME', () => {
    gamestate.set('POST_GAME');
    expect(get(gamestate)).toEqual('POST_GAME');
    expect(get(postGame)).toEqual(true);
    expect(get(preGame)).toEqual(false);
    expect(get(inGame)).toEqual(false);
  });
});

describe('#spies', () => {
  test('should return the spies in a game', () => {
    const spy1 = createPlayer();
    const spy2 = createPlayer();
    players['player::add'](spy1);
    players['player::add'](spy2);
    repeat(3, () => {
      players['player::add'](createPlayer());
    });

    let rules = generateRuleset(get(players));
    rules.spyIds = [spy1.id, spy2.id];
    ruleset.set(rules);

    expect(get(spies)).toEqual([spy1, spy2]);
  });

  test('should init with []', () => {
    expect(get(spies)).toEqual([]);
  });
});
