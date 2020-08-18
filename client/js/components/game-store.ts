import type { Gamestate, Ruleset } from '../../../types';
import { writable, derived } from 'svelte/store';
import { ruleset } from './rules-store';

export const gamestate = derived(
  ruleset,
  ($ruleset: Ruleset): Gamestate => {
    return !!Object.keys($ruleset).length ? 'IN_GAME' : 'PRE_GAME';
  },
);
export const preGame = derived(gamestate, ($gamestate) => $gamestate === 'PRE_GAME');
export const inGame = derived(gamestate, ($gamestate) => $gamestate === 'IN_GAME');
export const postGame = derived(gamestate, ($gamestate) => $gamestate === 'POST_GAME');
