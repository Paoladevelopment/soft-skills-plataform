import { RoomStatus } from '../types/room/room.models'

export const getStatusColor = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.LOBBY:
      return 'warning'
    case RoomStatus.ACTIVE:
      return 'info'
    case RoomStatus.FINISHED:
      return 'default'
    case RoomStatus.ARCHIVED:
      return 'default'
    default:
      return 'default'
  }
}

export const getStatusLabel = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.LOBBY:
      return 'Lobby'
    case RoomStatus.ACTIVE:
      return 'Active'
    case RoomStatus.FINISHED:
      return 'Finished'
    case RoomStatus.ARCHIVED:
      return 'Archived'
    default:
      return status
  }
}

