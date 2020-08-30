import type { Action } from '../types';
import { appstate } from '../stores/app';
import { leader } from '../stores/leader';
import { players } from '../stores/player';
import { rounds, roundstate } from '../stores/round';
import { ruleset } from '../stores/rules';
import { team } from '../stores/team';

// history::init must live outside of the actions otherwise it creates
// circular dependencies when looping through the events
export const actions = {
  'appstate::set': appstate['appstate::set'],
  'leader::change': leader['leader::change'],
  'player::add': players['player::add'],
  'rounds::init': rounds['rounds::init'],
  'roundstate::set': roundstate['roundstate::set'],
  'ruleset::generate': ruleset['ruleset::generate'],
  'team::confirmation': team['team::confirmation'],
  'team:reset': team['team:reset'],
  'team::selection': team['team::selection'],
};
export const actionNames: Action[] = Object.keys(actions);
