import type { Action } from '../types';
import { appstate } from '../stores/app';
import { leader, previousLeader } from '../stores/leader';
import { players } from '../stores/player';
import { rounds, roundstate } from '../stores/round';
import { ruleset } from '../stores/rules';
import { team, teamVotes } from '../stores/team';

// history::init must live outside of the actions otherwise it creates
// circular dependencies when looping through the events
export const actions = {
  'appstate::set': appstate['appstate::set'],
  'leader::change': (data) => {
    leader['leader::change'](data);
    previousLeader['leader::change'](data);
  },
  'player::add': players['player::add'],
  'rounds::init': rounds['rounds::init'],
  'rounds::update': rounds['rounds::update'],
  'roundstate::set': roundstate['roundstate::set'],
  'ruleset::generate': ruleset['ruleset::generate'],
  'team::confirmation': team['team::confirmation'],
  'team::reset': team['team::reset'],
  'team::selection': team['team::selection'],
  'teamvote::cast': teamVotes['teamvote::cast'],
  'teamvote::reset': teamVotes['teamvote::reset'],
};
export const actionNames: Action[] = Object.keys(actions);
