import type { PlayerId, MissionVote } from '../types';
import { derived, writable } from 'svelte/store';
import { currentRound } from './round';

export const missionVotes = (() => {
  const init: MissionVote[] = [];
  const { set, subscribe, update } = writable(init);

  return {
    subscribe,
    'missionvote::reset': () => set(init),
    'missionvote::cast': (vote: MissionVote) => {
      update((missionVotes) => (missionVotes = [...missionVotes, vote]));
    },
  };
})();

export const missionIsComplete = derived(
  [missionVotes, currentRound],
  ([$missionVotes, $currentRound]): boolean => {
    return $missionVotes.length >= $currentRound.teamSize;
  },
);

export const missionPassed = derived(
  [missionVotes, currentRound],
  ([$missionVotes, $currentRound]): boolean => {
    const failed = $missionVotes.filter((missionvote) => missionvote.vote === 'fail').length;

    return $currentRound.permittedMissionVoteFails >= failed;
  },
);
