import type { Action, HistoryEvent, Player } from '../types';
import { v4 as uuid } from 'uuid';
import { appstate } from '../stores/app';
import { history } from '../stores/history';
import { leader, previousLeader } from '../stores/leader';
import { missionVotes } from '../stores/mission';
import { currentPlayerId, players } from '../stores/player';
import { rounds, roundstate } from '../stores/round';
import { ruleset } from '../stores/rules';
import { team, teamVotes } from '../stores/team';

export function repeat(number: number, callback) {
  return Array.from(Array(number)).map((i) => callback());
}

export function createHistoryEvent(action: Action, data = {}): HistoryEvent {
  return { action, data, timestamp: Date.now(), id: uuid() };
}

export function createPlayer(player = {}): Player {
  const defaultPlayer = { avatar: randomEmoji(), name: randomName(), id: uuid() };

  return { ...defaultPlayer, ...player };
}

export function resetTestState() {
  appstate.reset();
  currentPlayerId.reset();
  history.reset();
  leader.reset();
  missionVotes['missionvote::reset']();
  players.reset();
  previousLeader.reset();
  rounds.reset();
  roundstate.reset();
  ruleset.reset();
  team['team::reset']();
  teamVotes['teamvote::reset']();
}

function randomEmoji() {
  // prettier-ignore
  const emojis = [
    '🐶','🐱','🦊','🐯','🦁',
    '🐸','🐼','🐨','🐵','🐻',
    '🐹','🐰','🐷','🐳','🐙',
    '🌞','👹','🐲','🤡','🤖',
    '☘️','🍄','🌺','🌸','🌼'
  ];
  return pickRandom(emojis);
}

function randomName() {
  // prettier-ignore
  const names = [
    'Aang', 'Zuko', 'Katara', 'Toph', 'Azula', 'Sokka', 'Appa',
    'Iroh', 'Firelord Ozai', 'Suki', 'Ty Lee', 'Princess Yue',
    'Long Feng', 'Roku', 'Admiral Zhao', 'Smellerbee', 'Hakoda',
  ];
  return pickRandom(names);
}

function pickRandom(values) {
  return values[Math.floor(Math.random() * values.length)];
}
