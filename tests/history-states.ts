import type { Action, HistoryEvent } from '../types';
import { v4 as uuid } from 'uuid';
import { createPlayer } from './test-helper';
import { generateRuleset } from '../stores/rules';

export function createHistoryEvent(action: Action, data = {}): HistoryEvent {
  return { action, data, timestamp: Date.now(), id: uuid() };
}

export const players = [
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
  createHistoryEvent('teamvote::cast', { playerId: spy2.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: spy3.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: p4.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p5.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p6.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p7.id, vote: '👍' }),
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

export const roundOneMissionPassed = [
  ...roundOneTeamApproved,
  createHistoryEvent('roundstate::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy1.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    0,
    {
      missionPhase: {
        team: [spy1.id, p6.id],
        votes: [
          { playerId: spy1.id, vote: 'pass' },
          { playerId: p6.id, vote: 'pass' },
        ],
        result: 'successful',
      },
    },
  ]),
  createHistoryEvent('leader::change', [players, spy1.id]),
  createHistoryEvent('roundstate::set', 'MISSION_REVEAL'),
];

export const roundOneMissionFailed = [
  ...roundOneTeamApproved,
  createHistoryEvent('roundstate::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy1.id, vote: 'fail' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    0,
    {
      missionPhase: {
        team: [spy1.id, p6.id],
        votes: [
          { playerId: spy1.id, vote: 'fail' },
          { playerId: p6.id, vote: 'pass' },
        ],
        result: 'failed',
      },
    },
  ]),
  createHistoryEvent('leader::change', [players, spy1.id]),
  createHistoryEvent('roundstate::set', 'MISSION_REVEAL'),
];

export const roundTwoStartP = [
  ...roundOneMissionPassed,
  createHistoryEvent('rounds::update', [0, { winner: 'resistance' }]),
  createHistoryEvent('missionvote::reset'),
  createHistoryEvent('team::reset'),
  createHistoryEvent('teamvote::reset'),
  createHistoryEvent('roundstate::set', 'TEAM_SELECTION'),
];

export const roundTwoStartF = [
  ...roundOneMissionFailed,
  createHistoryEvent('rounds::update', [0, { winner: 'spies' }]),
  createHistoryEvent('missionvote::reset'),
  createHistoryEvent('team::reset'),
  createHistoryEvent('teamvote::reset'),
  createHistoryEvent('roundstate::set', 'TEAM_SELECTION'),
];
