import type { Action, HistoryEvent, Player } from 'types';
import { v4 as uuid } from 'uuid';

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
    'Long Feng', 'P’Li', 'Suyin Beifong', 'Zuko', 'Kuvira', 'Yakone',
    'Pakku', 'Ming-Hua', 'Zaheer', 'Jeong Jeong', 'Amon', 'Tenzin',
    'Azula', 'Bhumi', 'Katara', 'Toph', 'Iroh', 'Korra', 'Ozai', 'Aang'
  ];
  return pickRandom(names);
}

function pickRandom(values) {
  return values[Math.floor(Math.random() * values.length)];
}
