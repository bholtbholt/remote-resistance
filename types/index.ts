export type Action = string;
export type Gamestate = 'PRE_GAME' | 'IN_GAME' | 'POST_GAME';
export type PlayerId = UUID;
type UUID = string;

export interface Game {
  rounds: Round[];
  players: PlayerId[];
  spies: PlayerId[];
  winner: 'resistance' | 'spies';
}

export interface HistoryEvent {
  action: Action;
  data: any;
  timestamp: number;
  id: UUID;
}

export interface MissionPhase {
  team: PlayerId[];
  votes: MissionVote[];
  result: 'successful' | 'failed';
}

export interface MissionVote {
  playerId: PlayerId;
  vote: 'success' | 'fail';
}

export interface Player {
  avatar: string;
  name: string;
  id: PlayerId;
}

export interface Round {
  teamBuildingPhase: TeamBuildingPhase[];
  missionPhase: MissionPhase;
  voteTrackMaximum: number;
  voteTrack: number;
  winner: 'resistance' | 'spies';
}

export interface Ruleset {
  playerIds: PlayerId[];
  spyIds: PlayerId[];
  playerCount: number;
  spyCount: number;
  missions: Object;
  failVoteTies: boolean;
  roundsToWin: number;
}

export interface TeamBuildingPhase {
  leader: PlayerId;
  team: PlayerId[];
  votes: TeamVote[];
  result: 'approved' | 'rejected';
}

export interface TeamVote {
  playerId: PlayerId;
  vote: 'approve' | 'reject';
}
