import type { Round, MissionPhase, Ruleset } from '../types';
import { writable, derived } from 'svelte/store';

const initMission: MissionPhase = {
  team: [],
  votes: [],
  result: undefined,
};

function initRound(rules): Round {
  const { name, teamSize, permittedMissionVoteFails, permittedTeamVoteFails } = rules;

  return {
    name,
    teamSize,
    permittedMissionVoteFails,
    teamBuildingPhase: [],
    missionPhase: initMission,
    permittedTeamVoteFails,
    failedTeamVotes: 0,
    winner: undefined,
  };
}

export const rounds = (() => {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    set,
    'rounds::init': (ruleset: Ruleset) => {
      const { permittedTeamVoteFails } = ruleset;
      const names = {
        1: 'first',
        2: 'second',
        3: 'third',
        4: 'fourth',
        5: 'last',
      };
      const initRounds = Object.entries(ruleset.missions).map(([missionId, missionRules]) => {
        const name: string = names[missionId];
        return initRound({ name, permittedTeamVoteFails, ...missionRules });
      });
      set(initRounds);
    },
  };
})();

export const currentRound = derived(
  rounds,
  ($rounds): Round => {
    return $rounds.find((round) => round.winner !== undefined) || $rounds[0];
  },
);

export const roundstate = (() => {
  const { set, subscribe } = writable('TEAM_SELECTION');

  return {
    subscribe,
    set,
    'roundstate::set': set,
  };
})();
