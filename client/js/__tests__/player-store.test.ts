import 'ts-jest';
import { createPlayer, repeat } from './test-helper';
import { get } from 'svelte/store';
import {
  currentPlayer,
  currentPlayerId,
  playerIsASpy,
  playerIsLoggedIn,
  players,
} from '../components/player-store';
import { generateRuleset, ruleset } from '../components/rules-store';

afterEach(() => {
  return players.set([]);
});

afterEach(() => {
  return currentPlayerId.set('');
});

describe('#players', () => {
  test('should init with no players', () => {
    expect(get(players)).toEqual([]);
  });

  test('should add a player', () => {
    const player = createPlayer();
    players['player::add'](player);

    expect(get(players)).toEqual([player]);
  });
});

describe('#currentPlayer', () => {
  test('should return the current player', () => {
    const player = createPlayer();
    players['player::add'](player);
    players['player::add'](createPlayer());
    players['player::add'](createPlayer());
    currentPlayerId.set(player.id);

    expect(get(currentPlayer)).toEqual(player);
  });

  test("should return nothing when the player isn't logged in", () => {
    players['player::add'](createPlayer());
    players['player::add'](createPlayer());

    expect(get(currentPlayer)).toEqual(undefined);
  });
});

describe('#playerIsLoggedIn', () => {
  test('should return true when player is logged in', () => {
    const player = createPlayer();
    players['player::add'](player);
    players['player::add'](createPlayer());
    players['player::add'](createPlayer());
    currentPlayerId.set(player.id);

    expect(get(playerIsLoggedIn)).toEqual(true);
  });

  test("should return false when player isn't logged in", () => {
    players['player::add'](createPlayer());
    players['player::add'](createPlayer());

    expect(get(playerIsLoggedIn)).toEqual(false);
  });
});

describe('#playerIsASpy', () => {
  test('should return true when player is a spy', () => {
    const player = createPlayer();
    players['player::add'](player);
    currentPlayerId.set(player.id);
    repeat(4, () => {
      players['player::add'](createPlayer());
    });

    let rules = generateRuleset(get(players));
    // Manually override spies to include player
    rules.spyIds = [player.id, get(players)[1].id];
    ruleset.set(rules);

    expect(get(ruleset).spyIds).toContain(player.id);
    expect(get(playerIsASpy)).toEqual(true);
  });

  test('should return false when player is resistance', () => {
    const player = createPlayer();
    players['player::add'](player);
    currentPlayerId.set(player.id);
    repeat(4, () => {
      players['player::add'](createPlayer());
    });

    let rules = generateRuleset(get(players));
    // Manually override spies to get the last two players
    rules.spyIds = [get(players)[3].id, get(players)[4].id];
    ruleset.set(rules);

    expect(get(ruleset).spyIds).not.toContain(player.id);
    expect(get(playerIsASpy)).toEqual(false);
  });
});
