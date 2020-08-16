import type { HistoryEvent } from 'types';
import { writable } from 'svelte/store';

// Build up all the stores to pass them through history::init
// which replays all historyEvents in order to build the state

// Import all stores with historyEvents
import { players } from './player-store';
import { ruleset } from './rules-store';

// The structure is not robust and requires the following:
//   eventNamespace: storeObject
// For example, event { action: 'player::add', data: {…} }
//   eventNamespace = 'player' (splitting from player::add)
//   storeObject = 'players' (from import { players } from './player-store';)
const allStores = {
  player: players,
  ruleset: ruleset,
};

function createStore() {
  const { set, subscribe, update } = writable([]);

  return {
    subscribe,
    'history::init': (historyEvents: HistoryEvent[]) => {
      set(historyEvents);

      // Replay all events in order:
      // - match the event namespace with the key in allStores
      // - call the store action with event data
      historyEvents.forEach(({ action, data }) => {
        const [eventNamespaceToStoreKey] = action.split('::');
        allStores[eventNamespaceToStoreKey][action](data);
      });
    },
  };
}

export const history = createStore();
