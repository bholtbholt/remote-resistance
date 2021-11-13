import type { Round, MissionPhase, Ruleset } from '../types';
import { writable, derived } from 'svelte/store';
import { roundsToWin } from './rules';

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
    'rounds::reset': () => set(init),
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

export const currentRoundIndex = (() => {
  const { subscribe, set, update } = writable(0);

  return {
    subscribe,
    'rounds::reset': () => set(0),
    'rounds::increment': () => update((i) => i + 1),
  };
})();

export const currentRound = derived(
  [rounds, currentRoundIndex],
  ([$rounds, $currentRoundIndex]): Round => {
    return $rounds[$currentRoundIndex] || initRound({});
  },
);

export const spiesWin = derived(rounds, ($rounds): boolean => {
  const wins = $rounds.filter((round) => round.winner === 'spies').length;
  return wins >= roundsToWin;
});

export const resistanceWin = derived(rounds, ($rounds): boolean => {
  const wins = $rounds.filter((round) => round.winner === 'resistance').length;
  return wins >= roundsToWin;
});

export const teamBuildingFailure = derived(currentRound, ($currentRound): boolean => {
  return $currentRound.failedTeamVotes > $currentRound.permittedTeamVoteFails;
});
