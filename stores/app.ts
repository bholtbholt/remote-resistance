import type { AppState } from '../types';
import { writable } from 'svelte/store';

export const appstate = (() => {
  const { set, subscribe } = writable<AppState>('PRE_GAME');

  return {
    subscribe,
    'appstate::set': set,
    'appstate::reset': () => {
      window.sessionStorage.removeItem('hideRoleReveal');
      set('PRE_GAME');
    },
    'appstate::init': () => {
      set('IN_GAME');
    },
  };
})();
