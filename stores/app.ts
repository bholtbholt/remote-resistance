import { writable } from 'svelte/store';

export const appstate = (() => {
  const { set, subscribe } = writable('PRE_GAME');

  return {
    subscribe,
    set,
    'appstate::set': set,
  };
})();
