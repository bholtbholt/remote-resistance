import type { Action } from '../types';
import { appstate } from '../stores/app';
import { leaderIndexes } from '../stores/leader';
import { missionVotes } from '../stores/mission';
import { players } from '../stores/player';
import { phase } from '../stores/phase';
import { rounds, currentRoundIndex } from '../stores/round';
import { ruleset } from '../stores/rules';
import { team, teamVotes } from '../stores/team';

// history::init must live outside of the actions otherwise it creates
// circular dependencies when looping through the events
export const actions = {
  'appstate::set': appstate['appstate::set'],
  'leader::init': leaderIndexes['leader::init'],
  'leader::change': leaderIndexes['leader::change'],
  'missionvote::cast': missionVotes['missionvote::cast'],
  'missionvote::reset': missionVotes['missionvote::reset'],
  'player::add': players['player::add'],
  'rounds::init': rounds['rounds::init'],
  'rounds::update': rounds['rounds::update'],
  'rounds::increment': currentRoundIndex['rounds::increment'],
  'rounds::reset': () => {
    rounds['rounds::reset']();
    currentRoundIndex['rounds::reset']();
  },
  'phase::set': phase['phase::set'],
  'ruleset::generate': ruleset['ruleset::generate'],
  'team::confirmation': team['team::confirmation'],
  'team::reset': team['team::reset'],
  'team::selection': team['team::selection'],
  'teamvote::cast': teamVotes['teamvote::cast'],
  'teamvote::reset': teamVotes['teamvote::reset'],
};
export const actionNames: Action[] = Object.keys(actions);
