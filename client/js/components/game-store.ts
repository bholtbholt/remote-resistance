import type { Gamestate, Player, Ruleset } from '../../../types';
import { writable, derived } from 'svelte/store';
import { ruleset } from './rules-store';
import { players } from './player-store';

function createStore() {
  const { set, subscribe } = writable('PRE_GAME');

  return {
    subscribe,
    set,
    'gamestate::set': (gamestate: Gamestate) => {
      set(gamestate);
    },
  };
}

export const gamestate = createStore();
export const preGame = derived(gamestate, ($gamestate) => $gamestate === 'PRE_GAME');
export const inGame = derived(gamestate, ($gamestate) => $gamestate === 'IN_GAME');
export const postGame = derived(gamestate, ($gamestate) => $gamestate === 'POST_GAME');
export const spies = derived([ruleset, players], ([$ruleset, $players]): Player[] => {
  return $players.filter((player) => $ruleset.spyIds.includes(player.id));
});
