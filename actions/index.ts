import type { Action } from '../types';
import { gamestate } from '../client/js/components/game-store';
import { players } from '../client/js/components/player-store';
import { ruleset } from '../client/js/components/rules-store';

// history::init must live outside of the actions otherwise it creates
// circular dependencies when looping through the events
  'gamestate::set': gamestate['gamestate::set'],
  'leader::new': leaderId['leader::new'],
  'player::add': players['player::add'],
  'ruleset::generate': ruleset['ruleset::generate'],
};
export const actionNames: Action[] = Object.keys(actions);
