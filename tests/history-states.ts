import { createPlayer, createHistoryEvent } from './test-helper';
import { generateRuleset } from '../stores/rules';

const players = [
  createPlayer(),
  createPlayer(),
  createPlayer(),
  createPlayer(),
  createPlayer(),
  createPlayer(),
  createPlayer(),
];
const [spy1, spy2, spy3, p4, p5, p6, p7] = players;

let ruleset = generateRuleset(players);
ruleset.spyIds = [spy1.id, spy2.id, spy3.id];

const votesApproved = [
  createHistoryEvent('teamvote::cast', { playerId: spy1.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: spy2.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: spy3.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: p4.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: p5.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p6.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p7.id, vote: '👎' }),
];

const votesRejected = [
  createHistoryEvent('teamvote::cast', { playerId: spy1.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: spy2.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: spy3.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p4.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p5.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p6.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p7.id, vote: '👎' }),
];

const votesPending = [
  createHistoryEvent('teamvote::cast', { playerId: spy1.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: spy2.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: spy3.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: p4.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p5.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p6.id, vote: '👎' }),
];

export const withPlayers = [
  createHistoryEvent('player::add', spy1),
  createHistoryEvent('player::add', spy2),
  createHistoryEvent('player::add', spy3),
  createHistoryEvent('player::add', p4),
  createHistoryEvent('player::add', p5),
  createHistoryEvent('player::add', p6),
  createHistoryEvent('player::add', p7),
];

export const roundOneStart = [
  ...withPlayers,
  createHistoryEvent('ruleset::generate', ruleset),
  createHistoryEvent('rounds::init', ruleset),
  createHistoryEvent('leader::change', [players, undefined]),
  createHistoryEvent('appstate::set', 'IN_GAME'),
];

export const roundOneTeam = [
  ...roundOneStart,
  createHistoryEvent('team::selection', spy1.id),
  createHistoryEvent('team::selection', p6.id),
  createHistoryEvent('team::confirmation', [spy1.id, p6.id]),
  createHistoryEvent('roundstate::set', 'TEAM_VOTE'),
];

export const roundOneVotesApproved = [...roundOneTeam, ...votesApproved];
export const roundOneVotesRejected = [...roundOneTeam, ...votesRejected];
export const roundOneVotesPending = [...roundOneTeam, ...votesPending];

export const roundOneTeamApproved = [
  ...roundOneTeam,
  ...votesApproved,
  createHistoryEvent('roundstate::set', 'TEAM_REVEAL'),
];

export const roundOneTeamRejected = [
  ...roundOneTeam,
  ...votesRejected,
  createHistoryEvent('roundstate::set', 'TEAM_REVEAL'),
];

export const roundOneNewVote = [
  ...roundOneTeamRejected,
  createHistoryEvent('rounds::update', [0, { failedTeamVotes: 1 }]),
  createHistoryEvent('leader::change', [players, spy1.id]),
  createHistoryEvent('roundstate::set', 'TEAM_REVEAL'),
];

export const roundOneLastVote = [
  ...roundOneTeamRejected,
  createHistoryEvent('rounds::update', [0, { failedTeamVotes: 4 }]),
  createHistoryEvent('leader::change', [players, spy1.id]),
  createHistoryEvent('roundstate::set', 'TEAM_REVEAL'),
];
