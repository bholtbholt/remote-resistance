import type { Player } from 'types';
import { writable, derived } from 'svelte/store';

function createStore() {
  const { subscribe, update } = writable([]);

  return {
    subscribe,
    'player::add': (player: Player) => {
      update((players) => (players = [...players, player]));
    },
  };
}

export const players = createStore();
