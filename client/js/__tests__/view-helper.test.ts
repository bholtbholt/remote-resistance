import 'ts-jest';
import { createPlayer, repeat } from './test-helper';
import { gridSize, playerNamesToSentance, toSentance } from '../components/view-helper';

test('should join an array with an and', () => {
  const players = ['Zuko', 'Aang'];

  expect(toSentance(players)).toEqual('Zuko and Aang');
});

test('should join an array with an oxford comma', () => {
  const players = ['Zuko', 'Aang', 'Katara'];
  const morePlayers = ['Zuko', 'Aang', 'Katara', 'Sokka'];

  expect(toSentance(players)).toEqual('Zuko, Aang, and Katara');
  expect(toSentance(morePlayers)).toEqual('Zuko, Aang, Katara, and Sokka');
});

test('should replace the player name with you', () => {
  const twoPlayer = ['Zuko', 'Aang'];
  const threePlayers = ['Zuko', 'Aang', 'Katara'];
  const fourPlayers = ['Zuko', 'Aang', 'Katara', 'Sokka'];

  expect(playerNamesToSentance(twoPlayer, 'Aang')).toEqual('You and Zuko');
  expect(playerNamesToSentance(threePlayers, 'Aang')).toEqual('You, Zuko, and Katara');
  expect(playerNamesToSentance(fourPlayers, 'Aang')).toEqual('You, Zuko, Katara, and Sokka');
});

test("should not replace the player name when it doesn't match", () => {
  const players = ['Zuko', 'Aang', 'Katara'];

  expect(playerNamesToSentance(players, 'Bill')).toEqual('Zuko, Aang, and Katara');
});

test('should use 2 columns with 2 players', () => {
  expect(gridSize(2)).toEqual('grid-cols-2');
});

test('should use 3 columns with 3 players', () => {
  expect(gridSize(3)).toEqual('grid-cols-3');
});

test('should use 4 columns with 4 players', () => {
  expect(gridSize(4)).toEqual('grid-cols-4');
});

test('should use 5 columns with 5 players', () => {
  expect(gridSize(5)).toEqual('grid-cols-5');
});

test('should use 3 columns with 6 players', () => {
  expect(gridSize(6)).toEqual('grid-cols-3 grid-rows-2');
});

test('should use 4 columns with 7 players', () => {
  expect(gridSize(7)).toEqual('grid-cols-4 grid-rows-2');
});

test('should use 4 columns with 8 players', () => {
  expect(gridSize(8)).toEqual('grid-cols-4 grid-rows-2');
});

test('should use 5 columns with 9 players', () => {
  expect(gridSize(9)).toEqual('grid-cols-5 grid-rows-2');
});

test('should use 5 columns with 10 players', () => {
  expect(gridSize(10)).toEqual('grid-cols-5 grid-rows-2');
});
