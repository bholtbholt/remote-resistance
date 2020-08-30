import 'ts-jest';
import { createPlayer, repeat } from './test-helper';
import { get } from 'svelte/store';
import {
  currentPlayer,
  currentPlayerId,
  playerIsASpy,
  playerIsLeader,
  playerIsLoggedIn,
  players,
  spies,
} from '../stores/player';
import { generateRuleset, ruleset } from '../stores/rules';
import { leader } from '../stores/leader';

afterEach(() => {
  return players.set([]);
});

afterEach(() => {
  return currentPlayerId.set('');
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

describe('#playerIsLeader', () => {
  test('should return true when the current player is the leader', () => {
    repeat(5, () => {
      players['player::add'](createPlayer());
    });
    const [p1] = get(players);
    currentPlayerId.set(p1.id);

    leader['leader::change']([get(players), undefined]);
    expect(get(playerIsLeader)).toEqual(true);
  });

  test("should return false when the current player isn't the leader", () => {
    repeat(5, () => {
      players['player::add'](createPlayer());
    });
    const [p1, p2] = get(players);
    currentPlayerId.set(p2.id);

    leader['leader::change']([get(players), undefined]);
    expect(get(playerIsLeader)).toEqual(false);
  });
});
