import 'ts-jest';
import { createPlayer, repeat } from './test-helper';
import { get } from 'svelte/store';
import { currentPlayerId, players } from '../stores/player';
import { leader, playerIsLeader } from '../stores/leader';

beforeEach(() => {
  repeat(5, () => {
    players['player::add'](createPlayer());
  });
});

afterEach(() => {
  return players.set([]);
});

test('should set a new leader', () => {
  const [p1] = get(players);

  leader['leader::change']([get(players), undefined]);
  expect(get(leader)).toEqual(p1);
});

test('should loop through leaders in succession', () => {
  const [p1, p2, p3, p4, p5] = get(players);

  leader['leader::change']([get(players), undefined]);
  expect(get(leader)).toEqual(p1);
  leader['leader::change']([get(players), p1.id]);
  expect(get(leader)).toEqual(p2);
  leader['leader::change']([get(players), p2.id]);
  expect(get(leader)).toEqual(p3);
  leader['leader::change']([get(players), p3.id]);
  expect(get(leader)).toEqual(p4);
  leader['leader::change']([get(players), p4.id]);
  expect(get(leader)).toEqual(p5);
  leader['leader::change']([get(players), p5.id]);
  expect(get(leader)).toEqual(p1);
});

test('should not pick a previous leader', () => {
  const [p1] = get(players);

  leader['leader::change']([get(players), undefined]);
  expect(get(leader)).toEqual(p1);
  leader['leader::change']([get(players), p1.id]);
  expect(get(leader)).not.toEqual(p1);
});

describe('#playerIsLeader', () => {
  test('should return true when the current player is the leader', () => {
    const [p1] = get(players);
    currentPlayerId.set(p1.id);

    leader['leader::change']([get(players), undefined]);
    expect(get(playerIsLeader)).toEqual(true);
  });

  test("should return false when the current player isn't the leader", () => {
    const [p1, p2] = get(players);
    currentPlayerId.set(p2.id);

    leader['leader::change']([get(players), undefined]);
    expect(get(playerIsLeader)).toEqual(false);
  });
});
