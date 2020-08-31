import type { PlayerId, TeamVote } from '../types';
import { writable } from 'svelte/store';

export const team = (() => {
  const initTeam = [];
  const { set, subscribe, update } = writable(initTeam);

  return {
    subscribe,
    set,
    'team::confirmation': (playerIds: PlayerId[]) => {
      set(playerIds);
    },
    'team:reset': () => {
      set(initTeam);
    },
    'team::selection': (playerId: PlayerId) => {
      update((team: PlayerId[]) => {
        const teamSet = new Set(team);
        teamSet.has(playerId) ? teamSet.delete(playerId) : teamSet.add(playerId);
        return (team = Array.from(teamSet.values()));
      });
    },
  };
})();

export const teamVotes = (() => {
  const { set, subscribe, update } = writable([]);

  return {
    subscribe,
    set,
    'teamvote:reset': () => {
      set([]);
    },
    'teamvote::cast': (vote: TeamVote) => {
      update((teamVotes) => (teamVotes = [...teamVotes, vote]));
    },
  };
})();
