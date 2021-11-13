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

export const votesApproved = [
  createHistoryEvent('teamvote::cast', { playerId: spy1.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: spy2.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: spy3.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: p4.id, vote: '👍' }),
  createHistoryEvent('teamvote::cast', { playerId: p5.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p6.id, vote: '👎' }),
  createHistoryEvent('teamvote::cast', { playerId: p7.id, vote: '👎' }),
];

export const votesRejected = [
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

const nextRound = [
  createHistoryEvent('missionvote::reset'),
  createHistoryEvent('team::reset'),
  createHistoryEvent('teamvote::reset'),
  createHistoryEvent('rounds::increment'),
  createHistoryEvent('phase::set', 'TEAM_SELECTION'),
];

///////////////////////////////////////////////////////////
// PRE GAME
///////////////////////////////////////////////////////////

export const withPlayers = [
  createHistoryEvent('player::add', spy1),
  createHistoryEvent('player::add', spy2),
  createHistoryEvent('player::add', spy3),
  createHistoryEvent('player::add', p4),
  createHistoryEvent('player::add', p5),
  createHistoryEvent('player::add', p6),
  createHistoryEvent('player::add', p7),
];

///////////////////////////////////////////////////////////
// ROUND 1
///////////////////////////////////////////////////////////

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
  createHistoryEvent('phase::set', 'TEAM_VOTE'),
];

export const roundOneVotesApproved = [...roundOneTeam, ...votesApproved];
export const roundOneVotesRejected = [...roundOneTeam, ...votesRejected];
export const roundOneVotesPending = [...roundOneTeam, ...votesPending];

export const roundOneTeamApproved = [
  ...roundOneTeam,
  ...votesApproved,
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundOneTeamRejected = [
  ...roundOneTeam,
  ...votesRejected,
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundOneNewVote = [
  ...roundOneTeamRejected,
  createHistoryEvent('rounds::update', [0, { failedTeamVotes: 1 }]),
  createHistoryEvent('leader::change', [players, spy1.id]),
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundOneLastVote = [
  ...roundOneTeamRejected,
  createHistoryEvent('rounds::update', [0, { failedTeamVotes: 4 }]),
  createHistoryEvent('leader::change', [players, p4.id]),
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundOneMissionPassed = [
  ...roundOneTeamApproved,
  createHistoryEvent('phase::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy1.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    0,
    {
      winner: 'resistance',
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
  createHistoryEvent('phase::set', 'MISSION_REVEAL'),
];

export const roundOneMissionFailed = [
  ...roundOneTeamApproved,
  createHistoryEvent('phase::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy1.id, vote: 'fail' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    0,
    {
      winner: 'spies',
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
  createHistoryEvent('phase::set', 'MISSION_REVEAL'),
];

///////////////////////////////////////////////////////////
// ROUND 2
///////////////////////////////////////////////////////////

export const roundTwoStart = [...roundOneMissionPassed, ...nextRound];

export const roundTwoTeam = [
  ...roundTwoStart,
  createHistoryEvent('team::selection', spy1.id),
  createHistoryEvent('team::selection', p6.id),
  createHistoryEvent('team::selection', p7.id),
  createHistoryEvent('team::confirmation', [spy1.id, p6.id, p7.id]),
  createHistoryEvent('phase::set', 'TEAM_VOTE'),
];

export const roundTwoVotesApproved = [...roundTwoTeam, ...votesApproved];
export const roundTwoVotesRejected = [...roundTwoTeam, ...votesRejected];
export const roundTwoVotesPending = [...roundTwoTeam, ...votesPending];

export const roundTwoTeamApproved = [
  ...roundTwoTeam,
  ...votesApproved,
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundTwoTeamRejected = [
  ...roundTwoTeam,
  ...votesRejected,
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundTwoNewVote = [
  ...roundTwoTeamRejected,
  createHistoryEvent('rounds::update', [1, { failedTeamVotes: 1 }]),
  createHistoryEvent('leader::change', [players, spy2.id]),
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundTwoLastVote = [
  ...roundTwoTeamRejected,
  createHistoryEvent('rounds::update', [1, { failedTeamVotes: 4 }]),
  createHistoryEvent('leader::change', [players, p5.id]),
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundTwoMissionPassed = [
  ...roundTwoTeamApproved,
  createHistoryEvent('phase::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy1.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p7.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    1,
    {
      winner: 'resistance',
      missionPhase: {
        team: [spy1.id, p6.id, p7.id],
        votes: [
          { playerId: spy1.id, vote: 'pass' },
          { playerId: p6.id, vote: 'pass' },
          { playerId: p7.id, vote: 'pass' },
        ],
        result: 'successful',
      },
    },
  ]),
  createHistoryEvent('leader::change', [players, spy2.id]),
  createHistoryEvent('phase::set', 'MISSION_REVEAL'),
];

export const roundTwoMissionFailed = [
  ...roundTwoTeamApproved,
  createHistoryEvent('phase::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy1.id, vote: 'fail' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p7.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    1,
    {
      winner: 'spies',
      missionPhase: {
        team: [spy1.id, p6.id, p7.id],
        votes: [
          { playerId: spy1.id, vote: 'fail' },
          { playerId: p6.id, vote: 'pass' },
          { playerId: p7.id, vote: 'pass' },
        ],
        result: 'failed',
      },
    },
  ]),
  createHistoryEvent('leader::change', [players, spy2.id]),
  createHistoryEvent('phase::set', 'MISSION_REVEAL'),
];

///////////////////////////////////////////////////////////
// ROUND 3
///////////////////////////////////////////////////////////

export const roundThreeStart = [...roundTwoMissionFailed, ...nextRound];

export const roundThreeTeam = [
  ...roundThreeStart,
  createHistoryEvent('team::selection', spy2.id),
  createHistoryEvent('team::selection', p6.id),
  createHistoryEvent('team::selection', p7.id),
  createHistoryEvent('team::confirmation', [spy2.id, p6.id, p7.id]),
  createHistoryEvent('phase::set', 'TEAM_VOTE'),
];

export const roundThreeVotesApproved = [...roundThreeTeam, ...votesApproved];
export const roundThreeVotesRejected = [...roundThreeTeam, ...votesRejected];
export const roundThreeVotesPending = [...roundThreeTeam, ...votesPending];

export const roundThreeTeamApproved = [
  ...roundThreeTeam,
  ...votesApproved,
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundThreeTeamRejected = [
  ...roundThreeTeam,
  ...votesRejected,
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundThreeNewVote = [
  ...roundThreeTeamRejected,
  createHistoryEvent('rounds::update', [2, { failedTeamVotes: 1 }]),
  createHistoryEvent('leader::change', [players, spy3.id]),
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundThreeLastVote = [
  ...roundThreeTeamRejected,
  createHistoryEvent('rounds::update', [2, { failedTeamVotes: 4 }]),
  createHistoryEvent('leader::change', [players, p6.id]),
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundThreeMissionPassed = [
  ...roundThreeTeamApproved,
  createHistoryEvent('phase::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy2.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p7.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    2,
    {
      winner: 'resistance',
      missionPhase: {
        team: [spy2.id, p6.id, p7.id],
        votes: [
          { playerId: spy2.id, vote: 'pass' },
          { playerId: p6.id, vote: 'pass' },
          { playerId: p7.id, vote: 'pass' },
        ],
        result: 'successful',
      },
    },
  ]),
  createHistoryEvent('leader::change', [players, spy3.id]),
  createHistoryEvent('phase::set', 'MISSION_REVEAL'),
];

export const roundThreeMissionFailed = [
  ...roundThreeTeamApproved,
  createHistoryEvent('phase::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy2.id, vote: 'fail' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p7.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    2,
    {
      winner: 'spies',
      missionPhase: {
        team: [spy2.id, p6.id, p7.id],
        votes: [
          { playerId: spy2.id, vote: 'fail' },
          { playerId: p6.id, vote: 'pass' },
          { playerId: p7.id, vote: 'pass' },
        ],
        result: 'failed',
      },
    },
  ]),
  createHistoryEvent('leader::change', [players, spy3.id]),
  createHistoryEvent('phase::set', 'MISSION_REVEAL'),
];

///////////////////////////////////////////////////////////
// ROUND 4
///////////////////////////////////////////////////////////

export const roundFourStart = [...roundThreeMissionPassed, ...nextRound];

export const roundFourTeam = [
  ...roundFourStart,
  createHistoryEvent('team::selection', spy1.id),
  createHistoryEvent('team::selection', spy2.id),
  createHistoryEvent('team::selection', p6.id),
  createHistoryEvent('team::selection', p7.id),
  createHistoryEvent('team::confirmation', [spy1.id, spy2.id, p6.id, p7.id]),
  createHistoryEvent('phase::set', 'TEAM_VOTE'),
];

export const roundFourVotesApproved = [...roundFourTeam, ...votesApproved];
export const roundFourVotesRejected = [...roundFourTeam, ...votesRejected];
export const roundFourVotesPending = [...roundFourTeam, ...votesPending];

export const roundFourTeamApproved = [
  ...roundFourTeam,
  ...votesApproved,
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundFourTeamRejected = [
  ...roundFourTeam,
  ...votesRejected,
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundFourNewVote = [
  ...roundFourTeamRejected,
  createHistoryEvent('rounds::update', [3, { failedTeamVotes: 1 }]),
  createHistoryEvent('leader::change', [players, p4.id]),
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundFourLastVote = [
  ...roundFourTeamRejected,
  createHistoryEvent('rounds::update', [3, { failedTeamVotes: 4 }]),
  createHistoryEvent('leader::change', [players, p7.id]),
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundFourMissionPassed = [
  ...roundFourTeamApproved,
  createHistoryEvent('phase::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy1.id, vote: 'fail' }),
  createHistoryEvent('missionvote::cast', { playerId: spy2.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p7.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    3,
    {
      winner: 'resistance',
      missionPhase: {
        team: [spy1.id, spy2.id, p6.id, p7.id],
        votes: [
          { playerId: spy1.id, vote: 'fail' },
          { playerId: spy2.id, vote: 'pass' },
          { playerId: p6.id, vote: 'pass' },
          { playerId: p7.id, vote: 'pass' },
        ],
        result: 'successful',
      },
    },
  ]),
  createHistoryEvent('leader::change', [players, p4.id]),
  createHistoryEvent('phase::set', 'MISSION_REVEAL'),
];

export const roundFourMissionFailed = [
  ...roundFourTeamApproved,
  createHistoryEvent('phase::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy1.id, vote: 'fail' }),
  createHistoryEvent('missionvote::cast', { playerId: spy2.id, vote: 'fail' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p7.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    3,
    {
      winner: 'spies',
      missionPhase: {
        team: [spy1.id, spy2.id, p6.id, p7.id],
        votes: [
          { playerId: spy1.id, vote: 'fail' },
          { playerId: spy2.id, vote: 'fail' },
          { playerId: p6.id, vote: 'pass' },
          { playerId: p7.id, vote: 'pass' },
        ],
        result: 'failed',
      },
    },
  ]),
  createHistoryEvent('leader::change', [players, p4.id]),
  createHistoryEvent('phase::set', 'MISSION_REVEAL'),
];

///////////////////////////////////////////////////////////
// ROUND 5
///////////////////////////////////////////////////////////

export const roundFiveStart = [...roundFourMissionFailed, ...nextRound];

export const roundFiveTeam = [
  ...roundFiveStart,
  createHistoryEvent('team::selection', spy1.id),
  createHistoryEvent('team::selection', spy2.id),
  createHistoryEvent('team::selection', p6.id),
  createHistoryEvent('team::selection', p7.id),
  createHistoryEvent('team::confirmation', [spy1.id, spy2.id, p6.id, p7.id]),
  createHistoryEvent('phase::set', 'TEAM_VOTE'),
];

export const roundFiveVotesApproved = [...roundFiveTeam, ...votesApproved];
export const roundFiveVotesRejected = [...roundFiveTeam, ...votesRejected];
export const roundFiveVotesPending = [...roundFiveTeam, ...votesPending];

export const roundFiveTeamApproved = [
  ...roundFiveTeam,
  ...votesApproved,
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundFiveTeamRejected = [
  ...roundFiveTeam,
  ...votesRejected,
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundFiveNewVote = [
  ...roundFiveTeamRejected,
  createHistoryEvent('rounds::update', [4, { failedTeamVotes: 1 }]),
  createHistoryEvent('leader::change', [players, p5.id]),
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundFiveLastVote = [
  ...roundFiveTeamRejected,
  createHistoryEvent('rounds::update', [4, { failedTeamVotes: 4 }]),
  createHistoryEvent('leader::change', [players, spy1.id]),
  createHistoryEvent('phase::set', 'TEAM_REVEAL'),
];

export const roundFiveMissionPassed = [
  ...roundFiveTeamApproved,
  createHistoryEvent('phase::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy1.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: spy2.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p7.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    4,
    {
      winner: 'resistance',
      missionPhase: {
        team: [spy1.id, spy2.id, p6.id, p7.id],
        votes: [
          { playerId: spy1.id, vote: 'pass' },
          { playerId: spy2.id, vote: 'pass' },
          { playerId: p6.id, vote: 'pass' },
          { playerId: p7.id, vote: 'pass' },
        ],
        result: 'successful',
      },
    },
  ]),
  createHistoryEvent('leader::change', [players, p5.id]),
  createHistoryEvent('phase::set', 'MISSION_REVEAL'),
];

export const roundFiveMissionFailed = [
  ...roundFiveTeamApproved,
  createHistoryEvent('phase::set', 'MISSION_START'),
  createHistoryEvent('missionvote::cast', { playerId: spy1.id, vote: 'fail' }),
  createHistoryEvent('missionvote::cast', { playerId: spy2.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p6.id, vote: 'pass' }),
  createHistoryEvent('missionvote::cast', { playerId: p7.id, vote: 'pass' }),
  createHistoryEvent('rounds::update', [
    4,
    {
      winner: 'spies',
      missionPhase: {
        team: [spy1.id, spy2.id, p6.id, p7.id],
        votes: [
          { playerId: spy1.id, vote: 'fail' },
          { playerId: spy2.id, vote: 'fail' },
          { playerId: p6.id, vote: 'pass' },
          { playerId: p7.id, vote: 'pass' },
        ],
        result: 'failed',
      },
    },
  ]),
  createHistoryEvent('leader::change', [players, p5.id]),
  createHistoryEvent('phase::set', 'MISSION_REVEAL'),
];
