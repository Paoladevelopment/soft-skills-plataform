import { fetchWithAuth } from '../../../utils/fetchWithAuth'
import { api } from '../../../config/api'
import { GetRoomsResponse, GetRoomResponse, CreateRoomRequest, UpdateRoomRequest, CreateRoomResponse, UpdateRoomResponse } from '../types/room/room.api'

export async function getUserRooms(
  offset: number,
  limit: number
): Promise<GetRoomsResponse> {
  const response = await fetchWithAuth(api.rooms.getAll(offset, limit))
  return response
}

export async function getRoomById(id: string): Promise<GetRoomResponse> {
  const response = await fetchWithAuth(api.rooms.byId(id))
  return response
}

export async function createRoom(roomData: CreateRoomRequest): Promise<CreateRoomResponse> {
  const response = await fetchWithAuth(api.rooms.create, {
    method: 'POST',
    body: JSON.stringify(roomData),
  })

  return response
}

export async function updateRoom(id: string, roomData: UpdateRoomRequest): Promise<UpdateRoomResponse> {
  const response = await fetchWithAuth(api.rooms.updateConfig(id), {
    method: 'PATCH',
    body: JSON.stringify(roomData.config),
  })

  return response
}

export async function deleteRoom(id: string): Promise<{ message: string }> {
  const response = await fetchWithAuth(api.rooms.delete(id), {
    method: 'DELETE',
  })
  
  return response
}

