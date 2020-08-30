import type { Player, PlayerId } from '../types';
import { writable, derived } from 'svelte/store';
import { currentPlayerId } from './player';

function createLeaderStore() {
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
}

export const leader = createLeaderStore();
export const playerIsLeader = derived(
  [currentPlayerId, leader],
  ([$currentPlayerId, $leader]): Boolean => {
    return $currentPlayerId === $leader.id;
  },
);
