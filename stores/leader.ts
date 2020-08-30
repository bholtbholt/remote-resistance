import type { Player, PlayerId } from '../types';
import { writable } from 'svelte/store';

export const leader = (() => {
  const { subscribe, set } = writable(undefined);

  return {
    subscribe,
    set,
    'leader::change': ([players, currentLeaderId]: [Player[], PlayerId]) => {
      const currentLeaderIndex = players.findIndex((player) => player.id === currentLeaderId);
      const newLeader = players[currentLeaderIndex + 1] || players[0];
      set(newLeader);
    },
  };
})();
