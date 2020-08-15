import type { Player, PlayerId } from 'types';
import { writable, derived } from 'svelte/store';

function createPlayersStore() {
  const { subscribe, update } = writable([]);

  return {
    subscribe,
    'player::add': (player: Player) => {
      update((players) => (players = [...players, player]));
    },
  };
}

function createCurrentPlayerIdStore() {
  const { subscribe, set } = writable('');

  return {
    subscribe,
    set: (playerId: PlayerId) => {
      set(playerId);
      window.sessionStorage.setItem('currentPlayerId', playerId);
    },
  };
}

export const players = createPlayersStore();
export const currentPlayerId = createCurrentPlayerIdStore();
export const playerIsLoggedIn = derived(
  [players, currentPlayerId],
  ([$players, $currentPlayerId]) => {
    return !!$players.find((player) => player.id === $currentPlayerId);
  },
);
