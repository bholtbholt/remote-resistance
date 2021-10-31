import { createPlayer, repeat } from './test-helper';
import { get } from 'svelte/store';
import {
  currentPlayer,
  currentPlayerId,
  playerIsASpy,
  playerIsLeader,
  playerIsLoggedIn,
  playerIsTeamMember,
  playerHasCompletedMission,
  players,
  spies,
  teamMembers,
  playerHasVoted,
  allPlayersHaveVoted,
} from '../stores/player';
import { generateRuleset, ruleset } from '../stores/rules';
import { leader } from '../stores/leader';
import { missionVotes } from '../stores/mission';
import { team, teamVotes } from '../stores/team';

beforeEach(() => {
  repeat(5, () => {
    players['player::add'](createPlayer());
  });
  return;
});

describe('#players', () => {
  beforeEach(() => {
    players.reset();
    return;
  });

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
    const [player] = get(players);
    currentPlayerId.set(player.id);

    expect(get(currentPlayer)).toEqual(player);
  });

  test("should return nothing when the player isn't logged in", () => {
    expect(get(currentPlayer)).toEqual(undefined);
  });
});

describe('#playerIsLoggedIn', () => {
  test('should return true when player is logged in', () => {
    const [player] = get(players);
    currentPlayerId.set(player.id);

    expect(get(playerIsLoggedIn)).toEqual(true);
  });

  test("should return false when player isn't logged in", () => {
    expect(get(playerIsLoggedIn)).toEqual(false);
  });
});

describe('#playerIsASpy', () => {
  test('should return true when player is a spy', () => {
    const [player, spy2] = get(players);
    currentPlayerId.set(player.id);

    let rules = generateRuleset(get(players));
    rules.spyIds = [player.id, spy2.id];
    ruleset['ruleset::generate'](rules);

    expect(get(ruleset).spyIds).toContain(player.id);
    expect(get(playerIsASpy)).toEqual(true);
  });

  test('should return false when player is resistance', () => {
    const [spy1, spy2, player] = get(players);
    currentPlayerId.set(player.id);

    let rules = generateRuleset(get(players));
    rules.spyIds = [spy1.id, spy2.id];
    ruleset['ruleset::generate'](rules);

    expect(get(ruleset).spyIds).not.toContain(player.id);
    expect(get(playerIsASpy)).toEqual(false);
  });
});

describe('#spies', () => {
  test('should return the spies in a game', () => {
    const [spy1, spy2] = get(players);

    let rules = generateRuleset(get(players));
    rules.spyIds = [spy1.id, spy2.id];
    ruleset['ruleset::generate'](rules);

    expect(get(spies)).toEqual([spy1, spy2]);
  });

  test('should init with []', () => {
    expect(get(spies)).toEqual([]);
  });
});

describe('#playerIsLeader', () => {
  test('should return true when the current player is the leader', () => {
    const [p1] = get(players);
    currentPlayerId.set(p1.id);

    leader['leader::change']([get(players), undefined]);
    expect(get(playerIsLeader)).toEqual(true);
  });

  test("should return false when the current player isn't the leader", () => {
    const [p1, p2] = get(players);
    currentPlayerId.set(p2.id);

    leader['leader::change']([get(players), undefined]);
    expect(get(playerIsLeader)).toEqual(false);
  });
});

describe('#playerIsTeamMember', () => {
  test('should return true when the current player in the team', () => {
    const [p1, p2] = get(players);
    currentPlayerId.set(p1.id);
    team['team::confirmation']([p1.id, p2.id]);

    expect(get(playerIsTeamMember)).toEqual(true);
  });

  test("should return false when the current player isn't in the team", () => {
    const [p1, p2, p3] = get(players);
    currentPlayerId.set(p3.id);
    team['team::confirmation']([p1.id, p2.id]);

    expect(get(playerIsTeamMember)).toEqual(false);
  });
});

describe('#teamMembers', () => {
  test('should return the team members', () => {
    const [p1, p2] = get(players);
    team['team::confirmation']([p1.id, p2.id]);

    expect(get(teamMembers)).toEqual([p1, p2]);
  });

  test('should init with []', () => {
    expect(get(teamMembers)).toEqual([]);
  });
});

describe('#playerHasVoted', () => {
  test('should return true when the player has voted', () => {
    const [p1, p2] = get(players);
    currentPlayerId.set(p1.id);

    team['team::confirmation']([p1.id, p2.id]);
    expect(get(playerHasVoted)).toEqual(false);
    teamVotes['teamvote::cast']({ playerId: p1.id, vote: '👍' });
    expect(get(playerHasVoted)).toEqual(true);
  });

  test('should return false when the player has not voted', () => {
    const [p1, p2] = get(players);
    currentPlayerId.set(p1.id);

    team['team::confirmation']([p1.id, p2.id]);
    teamVotes['teamvote::cast']({ playerId: p2.id, vote: '👍' });
    expect(get(playerHasVoted)).toEqual(false);
  });
});

describe('#allPlayersHaveVoted', () => {
  test('should return true when all players have voted', () => {
    const [p1, p2, p3, p4, p5] = get(players);

    team['team::confirmation']([p1.id, p2.id]);
    expect(get(allPlayersHaveVoted)).toEqual(false);
    teamVotes['teamvote::cast']({ playerId: p1.id, vote: '👍' });
    teamVotes['teamvote::cast']({ playerId: p2.id, vote: '👍' });
    teamVotes['teamvote::cast']({ playerId: p3.id, vote: '👍' });
    teamVotes['teamvote::cast']({ playerId: p4.id, vote: '👍' });
    teamVotes['teamvote::cast']({ playerId: p5.id, vote: '👍' });
    expect(get(allPlayersHaveVoted)).toEqual(true);
  });

  test('should return false when players have not voted', () => {
    const [p1, p2] = get(players);

    team['team::confirmation']([p1.id, p2.id]);
    teamVotes['teamvote::cast']({ playerId: p1.id, vote: '👍' });
    teamVotes['teamvote::cast']({ playerId: p2.id, vote: '👍' });
    expect(get(allPlayersHaveVoted)).toEqual(false);
  });
});

describe('#playerHasCompletedMission', () => {
  test('should return true when the player has voted', () => {
    const [p1, p2] = get(players);
    currentPlayerId.set(p1.id);

    team['team::confirmation']([p1.id, p2.id]);
    expect(get(playerHasCompletedMission)).toEqual(false);
    missionVotes['missionvote::cast']({ playerId: p1.id, vote: 'pass' });
    expect(get(playerHasCompletedMission)).toEqual(true);
  });

  test('should return false when the player has not voted', () => {
    const [p1, p2] = get(players);
    currentPlayerId.set(p1.id);

    team['team::confirmation']([p1.id, p2.id]);
    missionVotes['missionvote::cast']({ playerId: p2.id, vote: 'pass' });
    expect(get(playerHasCompletedMission)).toEqual(false);
  });
});
