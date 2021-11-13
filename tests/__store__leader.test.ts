import { createPlayer, repeat } from './test-helper';
import { get } from 'svelte/store';
import { players } from '../stores/player';
import { leader, previousLeader, leaderIndexes } from '../stores/leader';

beforeEach(() => {
  repeat(5, () => {
    players['player::add'](createPlayer());
  });
});

test('should loop through leaders in succession', () => {
  const [p1, p2, p3, p4, p5] = get(players);

  leaderIndexes['leader::init'](get(players));
  expect(get(leader)).toEqual(p1);

  leaderIndexes['leader::change']();
  expect(get(leader)).toEqual(p2);
  expect(get(previousLeader)).toEqual(p1);

  leaderIndexes['leader::change']();
  expect(get(leader)).toEqual(p3);
  expect(get(previousLeader)).toEqual(p2);

  leaderIndexes['leader::change']();
  expect(get(leader)).toEqual(p4);
  expect(get(previousLeader)).toEqual(p3);

  leaderIndexes['leader::change']();
  expect(get(leader)).toEqual(p5);
  expect(get(previousLeader)).toEqual(p4);

  leaderIndexes['leader::change']();
  expect(get(leader)).toEqual(p1);
  expect(get(previousLeader)).toEqual(p5);

  leaderIndexes['leader::change']();
  expect(get(leader)).toEqual(p2);
  expect(get(previousLeader)).toEqual(p1);
});

test('should not pick a previous leader', () => {
  const [p1] = get(players);

  leaderIndexes['leader::init'](get(players));
  expect(get(leader)).toEqual(p1);

  leaderIndexes['leader::change']();
  expect(get(leader)).not.toEqual(p1);
});
