import { repeat } from './test-helper';
import { get } from 'svelte/store';
import { team, teamVoteApproved, teamVotes } from '../stores/team';
import { nanoid } from 'nanoid/non-secure';

test('should add an id', () => {
  const id = nanoid();
  team['team::selection'](id);

  expect(get(team)).toEqual([id]);
});

test('should not add a duplicate id', () => {
  const id = nanoid();
  team['team::selection'](id);
  team['team::selection'](id);
  team['team::selection'](id);

  expect(get(team)).toEqual([id]);
});

test('should remove an id', () => {
  const id = nanoid();
  team['team::selection'](id);
  team['team::selection'](id);

  expect(get(team)).toEqual([]);
});

test('should cast a vote', () => {
  const id = nanoid();
  teamVotes['teamvote::cast']({ playerId: id, vote: '👍' });

  expect(get(teamVotes).length).toEqual(1);
  expect(get(teamVotes)[0]).toEqual({ playerId: id, vote: '👍' });
});

describe('#teamVoteApproved', () => {
  test('should return true when vote is approved', () => {
    repeat(6, () => {
      teamVotes['teamvote::cast']({ playerId: nanoid(), vote: '👍' });
    });

    expect(get(teamVoteApproved)).toEqual(true);
  });

  test('should return false when vote is rejected', () => {
    repeat(6, () => {
      teamVotes['teamvote::cast']({ playerId: nanoid(), vote: '👎' });
    });

    expect(get(teamVoteApproved)).toEqual(false);
  });

  test('should return false when vote is tied', () => {
    repeat(3, () => {
      teamVotes['teamvote::cast']({ playerId: nanoid(), vote: '👍' });
    });
    repeat(3, () => {
      teamVotes['teamvote::cast']({ playerId: nanoid(), vote: '👎' });
    });

    expect(get(teamVoteApproved)).toEqual(false);
  });
});
