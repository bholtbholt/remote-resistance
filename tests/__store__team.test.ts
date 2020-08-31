import 'ts-jest';
import { createPlayer, repeat } from './test-helper';
import { get } from 'svelte/store';
import { team, teamVotes } from '../stores/team';
import { v4 as uuid } from 'uuid';

afterEach(() => {
  team['team:reset']();
  teamVotes['teamvote:reset']();
  return;
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

test('should cast a vote', () => {
  const id = uuid();
  teamVotes['teamvote::cast']({ playerId: id, vote: '👍' });

  expect(get(teamVotes).length).toEqual(1);
  expect(get(teamVotes)[0]).toEqual({ playerId: id, vote: '👍' });
});
