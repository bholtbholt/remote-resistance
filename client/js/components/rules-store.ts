import type { Player, Ruleset } from '../../../types';
import { writable } from 'svelte/store';

export const maximumPlayerCount = 10;
export const minimumPlayerCount = 5;

function createStore() {
  const initRuleset: Ruleset = {
    playerCount: undefined,
    spyCount: undefined,
    playerIds: [],
    spyIds: [],
    missions: {},
    failVoteTies: undefined,
    roundsToWin: undefined,
  };
  const { set, subscribe, update } = writable(initRuleset);

  return {
    subscribe,
    set,
    'ruleset::generate': (ruleset: Ruleset) => {
      set(ruleset);
    },
  };
}

export const ruleset = createStore();

export function generateRuleset(players: Player[]): Ruleset {
  const playerCount = players.length;
  const ruleset = rules[playerCount];
  const missions = rules[playerCount]['missions'];

  const playerIds = players.map((p) => p.id);
  // Randomly pick 2 indexes from the player list
  // and assign the players as spies, stored in spyIds
  let randomSpyIndexes = [];
  const spyCount = ruleset.spies;
  while (randomSpyIndexes.length < spyCount) {
    const r = Math.floor(Math.random() * players.length);
    if (randomSpyIndexes.indexOf(r) === -1) randomSpyIndexes.push(r);
  }
  const spyIds = randomSpyIndexes.map((index) => players[index]['id']);

  return {
    playerCount,
    spyCount,
    playerIds,
    spyIds,
    missions,
    failVoteTies: true,
    roundsToWin: 3,
  };
}

const rules = {
  5: {
    players: 5,
    spies: 2,
    missions: {
      1: {
        teamSize: 2,
        permittedFails: 0,
      },
      2: {
        teamSize: 3,
        permittedFails: 0,
      },
      3: {
        teamSize: 2,
        permittedFails: 0,
      },
      4: {
        teamSize: 3,
        permittedFails: 0,
      },
      5: {
        teamSize: 3,
        permittedFails: 0,
      },
    },
  },
  6: {
    players: 6,
    spies: 2,
    missions: {
      1: {
        teamSize: 2,
        permittedFails: 0,
      },
      2: {
        teamSize: 3,
        permittedFails: 0,
      },
      3: {
        teamSize: 4,
        permittedFails: 0,
      },
      4: {
        teamSize: 3,
        permittedFails: 0,
      },
      5: {
        teamSize: 4,
        permittedFails: 0,
      },
    },
  },
  7: {
    players: 7,
    spies: 3,
    missions: {
      1: {
        teamSize: 2,
        permittedFails: 0,
      },
      2: {
        teamSize: 3,
        permittedFails: 0,
      },
      3: {
        teamSize: 3,
        permittedFails: 0,
      },
      4: {
        teamSize: 4,
        permittedFails: 1,
      },
      5: {
        teamSize: 4,
        permittedFails: 0,
      },
    },
  },
  8: {
    players: 8,
    spies: 3,
    missions: {
      1: {
        teamSize: 3,
        permittedFails: 0,
      },
      2: {
        teamSize: 4,
        permittedFails: 0,
      },
      3: {
        teamSize: 4,
        permittedFails: 0,
      },
      4: {
        teamSize: 5,
        permittedFails: 1,
      },
      5: {
        teamSize: 5,
        permittedFails: 0,
      },
    },
  },
  9: {
    players: 9,
    spies: 3,
    missions: {
      1: {
        teamSize: 3,
        permittedFails: 0,
      },
      2: {
        teamSize: 4,
        permittedFails: 0,
      },
      3: {
        teamSize: 4,
        permittedFails: 0,
      },
      4: {
        teamSize: 5,
        permittedFails: 1,
      },
      5: {
        teamSize: 5,
        permittedFails: 0,
      },
    },
  },
  10: {
    players: 10,
    spies: 4,
    missions: {
      1: {
        teamSize: 3,
        permittedFails: 0,
      },
      2: {
        teamSize: 4,
        permittedFails: 0,
      },
      3: {
        teamSize: 4,
        permittedFails: 0,
      },
      4: {
        teamSize: 5,
        permittedFails: 1,
      },
      5: {
        teamSize: 5,
        permittedFails: 0,
      },
    },
  },
};
