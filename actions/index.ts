import type { Action } from '../types';
import { gamestate } from '../stores/game';
import { leader } from '../stores/leader';
import { players } from '../stores/player';
import { ruleset } from '../stores/rules';

// history::init must live outside of the actions otherwise it creates
// circular dependencies when looping through the events
export const actions = {
  'gamestate::set': gamestate['gamestate::set'],
  'leader::change': leader['leader::change'],
  'player::add': players['player::add'],
  'ruleset::generate': ruleset['ruleset::generate'],
};
export const actionNames: Action[] = Object.keys(actions);
