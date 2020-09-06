import type { Player, PlayerId, Ruleset } from '../types';
import { writable, derived } from 'svelte/store';
import { ruleset } from './rules';
import { leader } from './leader';
import { missionVotes } from './mission';
import { team, teamVotes } from './team';

export const players = (() => {
  const init: Player[] = [];
  const { subscribe, set, update } = writable(init);

  return {
    subscribe,
    reset: () => set(init),
    'player::add': (player: Player) => {
      update((players) => (players = [...players, player]));
    },
  };
})();

export const spies = derived([ruleset, players], ([$ruleset, $players]): Player[] => {
  return $players.filter((player) => $ruleset.spyIds.includes(player.id));
});

export const teamMembers = derived([team, players], ([$team, $players]): Player[] => {
  return $players.filter((player) => $team.includes(player.id));
});

export const currentPlayerId = (() => {
  const init: PlayerId = '';
  const { subscribe, set } = writable(init);

  return {
    subscribe,
    reset: () => set(init),
    set: (playerId: PlayerId) => {
      set(playerId);
      window.sessionStorage.setItem('currentPlayerId', playerId);
    },
  };
})();

export const currentPlayer = derived(
  [players, currentPlayerId],
  ([$players, $currentPlayerId]): Player => {
    return $players.find((player) => player.id === $currentPlayerId);
  },
);

export const playerIsLoggedIn = derived(
  [players, currentPlayerId],
  ([$players, $currentPlayerId]): Boolean => {
    return !!$players.find((player) => player.id === $currentPlayerId);
  },
);

export const playerIsASpy = derived(
  [currentPlayerId, ruleset],
  ([$currentPlayerId, $ruleset]): Boolean => {
    return $ruleset.spyIds.includes($currentPlayerId);
  },
);

export const playerIsLeader = derived(
  [currentPlayerId, leader],
  ([$currentPlayerId, $leader]): Boolean => {
    return $currentPlayerId === $leader.id;
  },
);

export const playerIsTeamMember = derived(
  [currentPlayerId, team],
  ([$currentPlayerId, $team]): Boolean => {
    return $team.includes($currentPlayerId);
  },
);

export const playerHasVoted = derived(
  [teamVotes, currentPlayerId],
  ([$teamVotes, $currentPlayerId]): Boolean => {
    return !!$teamVotes.find((vote) => vote.playerId === $currentPlayerId);
  },
);

export const allPlayersHaveVoted = derived(
  [teamVotes, players],
  ([$teamVotes, $players]): Boolean => {
    return $teamVotes.length === $players.length;
  },
);

export const playerHasCompletedMission = derived(
  [missionVotes, currentPlayerId],
  ([missionVotes, $currentPlayerId]): Boolean => {
    return !!missionVotes.find((vote) => vote.playerId === $currentPlayerId);
  },
);
