import type { HistoryEvent } from 'types';
import { writable } from 'svelte/store';

// Build up all the stores to pass them through history::init
// which replays all historyEvents in order to build the state

// Import all stores
import { players } from './player-store';

// The structure is not robust and requires the following:
//   eventNamespace: storeObject
// For example, event { action: 'history::add', data: {…} }
//   eventNamespace = 'history'
//   storeObject = import { history } from './history-store';
const allStores = {
  player: players,
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
    'history::add': (historyEvent: HistoryEvent) => {
      update((historyEvents) => (historyEvents = [...historyEvents, historyEvent]));
    },
  };
}

export const history = createStore();
