import type { PlayerId, TeamVote } from '../types';
import { derived, writable } from 'svelte/store';

export const team = (() => {
  const init: PlayerId[] = [];
  const { set, subscribe, update } = writable(init);

  return {
    subscribe,
    'team::reset': () => set(init),
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
  const init: TeamVote[] = [];
  const { set, subscribe, update } = writable(init);

  return {
    subscribe,
    'teamvote::reset': () => set(init),
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
