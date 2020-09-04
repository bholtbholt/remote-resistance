import type { PlayerId, TeamVote } from '../types';
import { derived, writable } from 'svelte/store';

export const team = (() => {
  const { set, subscribe, update } = writable([]);

  return {
    subscribe,
    'team::reset': () => set([]),
    'team::confirmation': (playerIds: PlayerId[]) => {
      set(playerIds);
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
    'teamvote::reset': () => set([]),
    'teamvote::cast': (vote: TeamVote) => {
      update((teamVotes) => (teamVotes = [...teamVotes, vote]));
    },
  };
})();

export const teamVoteApproved = derived(teamVotes, ($teamVotes): boolean => {
  const approved = $teamVotes.filter((teamVote) => teamVote.vote === '👍').length;
  const rejected = $teamVotes.length - approved;

  return approved > rejected;
});
