import { get } from 'svelte/store';
import { phaseTeamBuilding } from '../stores/phase';
import { history } from '../stores/history';
import {
  createHistoryEvent,
  roundOneStart,
  roundOneTeam,
  roundOneTeamApproved,
  roundOneMissionPassed,
} from './history-states';

describe('#phaseTeamBuilding', () => {
  test('should return true when in TEAM_SELECTION phase', () => {
    history['history::init'](roundOneStart);
    const phase = get(phaseTeamBuilding);
    expect(phase).toBeTruthy();
  });

  test('should return true when in TEAM_VOTE phase', () => {
    history['history::init'](roundOneTeam);
    const phase = get(phaseTeamBuilding);
    expect(phase).toBeTruthy();
  });

  test('should return true when in TEAM_REVEAL phase', () => {
    history['history::init'](roundOneTeamApproved);
    const phase = get(phaseTeamBuilding);
    expect(phase).toBeTruthy();
  });

  test('should return false when in MISSION_START phase', () => {
    history['history::init']([
      ...roundOneTeamApproved,
      createHistoryEvent('phase::set', 'MISSION_START'),
    ]);
    const phase = get(phaseTeamBuilding);
    expect(phase).toBeFalsy();
  });

  test('should return false when in MISSION_REVEAL phase', () => {
    history['history::init'](roundOneMissionPassed);
    const phase = get(phaseTeamBuilding);
    expect(phase).toBeFalsy();
  });
});
