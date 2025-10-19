export enum RoomStatus {
  LOBBY = 'lobby',
  ACTIVE = 'active',
  FINISHED = 'finished',
  ARCHIVED = 'archived',
}

export enum RoomDifficulty {
  EASY = 'easy',
  INTERMEDIATE = 'intermediate',
  HARD = 'hard',
}

export enum AllowedType {
  DESCRIPTIVE = 'descriptive',
  CONVERSATIONAL = 'conversational',
  HISTORICAL_EVENT = 'historical_event',
  INSTRUCTIONAL = 'instructional',
  DIALOGUE = 'dialogue',
  NARRATIVE = 'narrative',
  NARRATIVE_DIALOGUE = 'narrative_dialogue',
}

export enum TeamAssignmentMode {
  RANDOM = 'random',
  MANUAL = 'manual',
}

export interface AudioEffects {
  reverb: number | null
  echo: number | null
  noise: number | null
  speedVar: number | null
}

export interface RoomConfig {
  roundsTotal: number
  roundTimeLimitSec: number
  listenerMaxPlaybacks: number
  allowedTypes: AllowedType[]
  difficulty: RoomDifficulty
  audioEffects: AudioEffects
  teamAssignmentMode: TeamAssignmentMode
  teamSize: number
}

export interface Team {
  id: string
  name: string
  memberCount: number
}

export interface BaseRoom {
  id: string
  name: string
  status: RoomStatus
  createdAt: string
}

export interface RoomListItem extends BaseRoom {
  maxPlayers: number
  playersCount: number
}

export interface Room extends RoomListItem {
  startedAt: string | null
  finishedAt: string | null
  config: RoomConfig
  teams: Team[]
}

