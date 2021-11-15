import { writable } from 'svelte/store';

export const appstate = (() => {
  const { set, subscribe } = writable('PRE_GAME');

  return {
    subscribe,
    'appstate::reset': () => {
      window.sessionStorage.removeItem('hideRoleReveal');
      set('PRE_GAME');
    },
    'appstate::init': () => {
      set('IN_GAME');
    },
  };
})();
