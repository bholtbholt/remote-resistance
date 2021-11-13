import { writable, derived } from 'svelte/store';

export const phase = (() => {
  const { set, subscribe } = writable('TEAM_SELECTION');

  return {
    subscribe,
    'phase::reset': () => set('TEAM_SELECTION'),
    'phase::set': set,
  };
})();

export const phaseTeamBuilding = derived(phase, ($phase): boolean => {
  const phases = ['TEAM_SELECTION', 'TEAM_VOTE', 'TEAM_REVEAL'];
  return phases.includes($phase);
});
