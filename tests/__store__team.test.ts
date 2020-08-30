import 'ts-jest';
import { createPlayer, repeat } from './test-helper';
import { get } from 'svelte/store';
import { team } from '../stores/team';
import { v4 as uuid } from 'uuid';

afterEach(() => {
  return team['team:reset']();
});

test('should add an id', () => {
  const id = uuid();
  team['team::selection'](id);

  expect(get(team)).toEqual([id]);
});

test('should not add a duplicate id', () => {
  const id = uuid();
  team['team::selection'](id);
  team['team::selection'](id);
  team['team::selection'](id);

  expect(get(team)).toEqual([id]);
});

test('should remove an id', () => {
  const id = uuid();
  team.set([id]);
  team['team::selection'](id);

  expect(get(team)).toEqual([]);
});
