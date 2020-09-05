import type { Player, PlayerId } from '../types';
import { derived, writable } from 'svelte/store';

const init: Player = {
  id: undefined,
  name: undefined,
  avatar: undefined,
};

export const leader = (() => {
  const { subscribe, set } = writable(init);

  return {
    subscribe,
    reset: () => set(init),
    'leader::change': ([players, currentLeaderId]: [Player[], PlayerId]) => {
      const currentLeaderIndex = players.findIndex((player) => player.id === currentLeaderId);
      const newLeader = players[currentLeaderIndex + 1] || players[0];
      set(newLeader);
    },
  };
})();

// 'leader::change' action is wrapped to fire both leader and previousLeader in succession
// It must match the leader API
export const previousLeader = (() => {
  const { subscribe, set } = writable(init);

  return {
    subscribe,
    reset: () => set(init),
    'leader::change': ([players, currentLeaderId]: [Player[], PlayerId]) => {
      const currentLeaderIndex = players.findIndex((player) => player.id === currentLeaderId);
      const currentLeader = players[currentLeaderIndex] || players[0];
      set(currentLeader);
    },
  };
})();
