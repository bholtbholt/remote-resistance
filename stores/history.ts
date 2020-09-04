import type { HistoryEvent } from '../types';
import { derived, writable } from 'svelte/store';
import { actions } from '../actions';

export const history = (() => {
  const { set, subscribe } = writable(undefined);

  return {
    subscribe,
    reset: () => set(undefined),
    'history::init': (historyEvents: HistoryEvent[]) => {
      // Replay all events in order then set history:
      historyEvents.forEach(({ action, data }) => {
        actions[action](data);
      });
      set(historyEvents);
    },
  };
})();

export const historyIsLoaded = derived(history, ($history) => Array.isArray($history));
