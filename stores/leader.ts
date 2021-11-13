import type { Player } from '../types';
import { derived, writable } from 'svelte/store';

export const leaderIndexes = (() => {
  const initPlayer: Player = {
    id: undefined,
    name: undefined,
    avatar: undefined,
  };
  const init = {
    players: [initPlayer],
    max: 0,
    current: 0,
    previous: 0,
  };
  const { subscribe, set, update } = writable(init);

  return {
    subscribe,
    reset: () => set(init),
    'leader::init': (players: Player[]) => {
      update(($leader) => {
        return {
          ...$leader,
          players,
          max: players.length - 1,
        };
      });
    },
    'leader::change': () => {
      update(($leader) => {
        const previous = $leader.current;
        const current = $leader.current + 1 > $leader.max ? 0 : $leader.current + 1;

        return {
          ...$leader,
          previous,
          current,
        };
      });
    },
  };
})();

export const leader = derived(leaderIndexes, ($leaderIndexes): Player => {
  return $leaderIndexes.players[$leaderIndexes.current];
});

export const previousLeader = derived(leaderIndexes, ($leaderIndexes): Player => {
  return $leaderIndexes.players[$leaderIndexes.previous];
});
