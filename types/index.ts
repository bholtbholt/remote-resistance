type NanoID = string;
export type Action = string;
export type PlayerId = NanoID;

export interface HistoryEvent {
  action: Action;
  data: any;
  timestamp: number;
  id: NanoID;
}

export interface MissionPhase {
  team: PlayerId[];
  votes: MissionVote[];
  result: 'successful' | 'failed';
}

export interface MissionVote {
  playerId: PlayerId;
  vote: 'pass' | 'fail';
}

export interface Player {
  avatar: string;
  name: string;
  id: PlayerId;
}

export interface Round {
  name: string;
  index: number;
  teamSize: number;
  failedTeamVotes: number;
  permittedTeamVoteFails: number;
  permittedMissionVoteFails: number;
  missionPhase: MissionPhase;
  winner: 'resistance' | 'spies';
}

export interface Ruleset {
  playerIds: PlayerId[];
  spyIds: PlayerId[];
  playerCount: number;
  spyCount: number;
  missions: Object;
  failTies: boolean;
  permittedTeamVoteFails: number;
}

export interface TeamVote {
  playerId: PlayerId;
  vote: '👍' | '👎';
}
