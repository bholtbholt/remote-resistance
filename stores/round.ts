import type { Round, MissionPhase, Ruleset } from '../types';
import { writable, derived } from 'svelte/store';

const initMission: MissionPhase = {
  team: [],
  votes: [],
  result: undefined,
};

function initRound(rules): Round {
  const { name, index, teamSize, permittedMissionVoteFails, permittedTeamVoteFails } = rules;

  return {
    name,
    index,
    teamSize,
    permittedMissionVoteFails,
    missionPhase: initMission,
    permittedTeamVoteFails,
    failedTeamVotes: 0,
    winner: undefined,
  };
}

export const rounds = (() => {
  const init: Round[] = [];
  const { subscribe, set, update } = writable(init);

  return {
    subscribe,
    reset: () => set(init),
    'rounds::update': ([roundIndex, props]: [number, Object]) => {
      update(($rounds) => {
        $rounds[roundIndex] = { ...$rounds[roundIndex], ...props };
        return $rounds;
      });
    },
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
        const index: number = parseInt(missionId, 10) - 1;
        return initRound({ name, index, permittedTeamVoteFails, ...missionRules });
      });
      set(initRounds);
    },
  };
})();

export const currentRound = derived(
  rounds,
  ($rounds): Round => {
    return $rounds.find((round) => round.winner === undefined) || initRound({});
  },
);

export const roundstate = (() => {
  const { set, subscribe } = writable('TEAM_SELECTION');

  return {
    subscribe,
    reset: () => set('TEAM_SELECTION'),
    'roundstate::set': set,
  };
})();
