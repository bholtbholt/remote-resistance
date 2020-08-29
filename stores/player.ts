import type { Player, PlayerId, Ruleset } from '../types';
import { writable, derived } from 'svelte/store';
import { ruleset } from './rules';

function createPlayersStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
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
