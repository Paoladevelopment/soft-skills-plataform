import { RoomListItem, Room } from './room.models'
import { CreateRoomRequest, UpdateRoomRequest } from './room.api'

export interface RoomsPagination {
  total: number
  offset: number
  limit: number
}

export interface IRoomStore {
  rooms: RoomListItem[]
  selectedRoom: Room | null
  isLoading: boolean
  roomsPagination: RoomsPagination

  setRooms: (rooms: RoomListItem[]) => void
  setSelectedRoom: (room: Room | null) => void
  setRoomsOffset: (offset: number) => void
  setRoomsLimit: (limit: number) => void
  setRoomsTotal: (total: number) => void

  fetchRooms: (offset?: number, limit?: number) => Promise<void>
  getRoomById: (id: string) => Promise<void>
  createRoom: (roomData: CreateRoomRequest) => Promise<void>
  updateRoom: (id: string, roomData: UpdateRoomRequest) => Promise<void>
  deleteRoom: (id: string) => Promise<void>
}
