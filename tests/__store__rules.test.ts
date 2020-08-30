import 'ts-jest';
import { createPlayer, repeat } from './test-helper';
import { generateRuleset } from '../stores/rules';

test('should generate a ruleset for 5 players', () => {
  const players = repeat(5, createPlayer);
  const ruleset = generateRuleset(players);

  expect(5).toEqual(ruleset.playerIds.length);
  expect(2).toEqual(ruleset.spyIds.length);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[1]);
});

test('should generate a ruleset for 6 players', () => {
  const players = repeat(6, createPlayer);
  const ruleset = generateRuleset(players);

  expect(6).toEqual(ruleset.playerIds.length);
  expect(2).toEqual(ruleset.spyIds.length);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[1]);
});

test('should generate a ruleset for 7 players', () => {
  const players = repeat(7, createPlayer);
  const ruleset = generateRuleset(players);

  expect(7).toEqual(ruleset.playerIds.length);
  expect(3).toEqual(ruleset.spyIds.length);
  expect(ruleset.missions[4]['permittedMissionVoteFails']).toEqual(1);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[1]);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[2]);
  expect(ruleset.spyIds[1]).not.toEqual(ruleset.spyIds[2]);
});

test('should generate a ruleset for 8 players', () => {
  const players = repeat(8, createPlayer);
  const ruleset = generateRuleset(players);

  expect(8).toEqual(ruleset.playerIds.length);
  expect(3).toEqual(ruleset.spyIds.length);
  expect(ruleset.missions[4]['permittedMissionVoteFails']).toEqual(1);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[1]);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[2]);
  expect(ruleset.spyIds[1]).not.toEqual(ruleset.spyIds[2]);
});

test('should generate a ruleset for 9 players', () => {
  const players = repeat(9, createPlayer);
  const ruleset = generateRuleset(players);

  expect(9).toEqual(ruleset.playerIds.length);
  expect(3).toEqual(ruleset.spyIds.length);
  expect(ruleset.missions[4]['permittedMissionVoteFails']).toEqual(1);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[1]);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[2]);
  expect(ruleset.spyIds[1]).not.toEqual(ruleset.spyIds[2]);
});

test('should generate a ruleset for 10 players', () => {
  const players = repeat(10, createPlayer);
  const ruleset = generateRuleset(players);

  expect(10).toEqual(ruleset.playerIds.length);
  expect(4).toEqual(ruleset.spyIds.length);
  expect(ruleset.missions[4]['permittedMissionVoteFails']).toEqual(1);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[1]);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[2]);
  expect(ruleset.spyIds[0]).not.toEqual(ruleset.spyIds[3]);
  expect(ruleset.spyIds[1]).not.toEqual(ruleset.spyIds[2]);
  expect(ruleset.spyIds[1]).not.toEqual(ruleset.spyIds[3]);
  expect(ruleset.spyIds[2]).not.toEqual(ruleset.spyIds[3]);
});
