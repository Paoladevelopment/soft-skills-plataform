import { Room, RoomListItem, AllowedType, RoomDifficulty, TeamAssignmentMode } from './room.models'

export interface GetRoomResponse {
  message: string
  data: Room
}

export interface GetRoomsResponse {
  message: string
  data: RoomListItem[]
  total: number
  offset: number
  limit: number
}

export interface AudioEffectsPayload {
  reverb: number | null
  echo: number | null
  noise: number | null
  speed_var: number | null
}

export interface RoomConfigPayload {
  rounds_total: number
  round_time_limit_sec: number
  listener_max_playbacks: number
  allowed_types: AllowedType[]
  difficulty: RoomDifficulty
  audio_effects: AudioEffectsPayload
  team_assignment_mode: TeamAssignmentMode
  team_size: number
}

export interface CreateRoomRequest {
  name: string
  config: RoomConfigPayload
}

export interface CreateRoomResponse {
  message: string
  data: Room
}

export interface UpdateRoomRequest {
  name?: string
  config?: Partial<RoomConfigPayload>
}

export interface UpdateRoomResponse {
  message: string
  data: Room
}

