import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IRoomStore } from '../types/room/room.store'
import { CreateRoomRequest, UpdateRoomRequest, UpdateConfigRoomRequest } from '../types/room/room.api'
import { useToastStore } from '../../../store/useToastStore'
import { RoomListItem, Room } from '../types/room/room.models'
import { getUserRooms, getRoomById, createRoom, updateRoom, updateRoomConfig, deleteRoom } from '../api/Rooms'

export const useRoomStore = create<IRoomStore>()(
  devtools(
    immer((set, get) => ({
      rooms: [],
      selectedRoom: null,
      isLoading: false,

      roomsPagination: {
        total: 0,
        offset: 0,
        limit: 10,
      },

      setRooms: (rooms: RoomListItem[]) => {
        set((state) => {
          state.rooms = rooms
        }, false, 'ROOM/SET_ROOMS')
      },

      setSelectedRoom: (room: Room | null) => {
        set((state) => {
          state.selectedRoom = room
        }, false, 'ROOM/SET_SELECTED_ROOM')
      },

      setRoomsOffset: (offset: number) => {
        set((state) => {
          state.roomsPagination.offset = offset
        }, false, 'ROOM/SET_OFFSET')
      },

      setRoomsLimit: (limit: number) => {
        set((state) => {
          state.roomsPagination.limit = limit
        }, false, 'ROOM/SET_LIMIT')
      },

      setRoomsTotal: (total: number) => {
        set((state) => {
          state.roomsPagination.total = total
        }, false, 'ROOM/SET_TOTAL')
      },

      fetchRooms: async (offset?: number, limit?: number) => {
        const currentOffset = offset ?? get().roomsPagination.offset
        const currentLimit = limit ?? get().roomsPagination.limit

        set((state) => {
          state.isLoading = true
        }, false, 'ROOM/FETCH_ROOMS_REQUEST')

        try {
          const { data, total } = await getUserRooms(currentOffset, currentLimit)

          get().setRooms(data)
          get().setRoomsTotal(total)
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error fetching rooms', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROOM/FETCH_ROOMS_COMPLETE')
        }
      },

      getRoomById: async (id: string) => {
        set((state) => {
          state.isLoading = true
        }, false, 'ROOM/FETCH_BY_ID_REQUEST')

        try {
          const { data } = await getRoomById(id)
          get().setSelectedRoom(data)
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error fetching room', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROOM/FETCH_BY_ID_COMPLETE')
        }
      },

      createRoom: async (roomData: CreateRoomRequest) => {
        set((state) => {
          state.isLoading = true
        }, false, 'ROOM/CREATE_REQUEST')

        try {
          const { data, message } = await createRoom(roomData)
          useToastStore.getState().showToast(message || 'Room created successfully!', 'success')

          const newRoomListItem: RoomListItem = {
            id: data.id,
            name: data.name,
            status: data.status,
            createdAt: data.createdAt,
            maxPlayers: data.maxPlayers,
            playersCount: data.playersCount,
          }

          set((state) => {
            state.rooms = [newRoomListItem, ...state.rooms]
            state.roomsPagination.total += 1
          }, false, 'ROOM/ADD_NEW_ROOM')
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error creating room', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROOM/CREATE_COMPLETE')
        }
      },

      updateRoom: async (id: string, roomData: UpdateRoomRequest) => {
        set((state) => {
          state.isLoading = true
        }, false, 'ROOM/UPDATE_REQUEST')

        try {
          const { message } = await updateRoom(id, roomData)
          useToastStore.getState().showToast(message || 'Room updated successfully!', 'success')

          get().fetchRooms()
          
          if (get().selectedRoom?.id === id) {
            await get().getRoomById(id)
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message, 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROOM/UPDATE_COMPLETE')
        }
      },

      updateRoomConfig: async (id: string, roomData: UpdateConfigRoomRequest) => {
        set((state) => {
          state.isLoading = true
        }, false, 'ROOM/UPDATE_CONFIG_REQUEST')

        try {
          const { message } = await updateRoomConfig(id, roomData)
          useToastStore.getState().showToast(message || 'Room configuration updated successfully!', 'success')

          get().fetchRooms()
          
          if (get().selectedRoom?.id === id) {
            await get().getRoomById(id)
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error updating room', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROOM/UPDATE_COMPLETE')
        }
      },

      deleteRoom: async (id: string) => {
        try {
          const { message } = await deleteRoom(id)

          set((state) => {
            state.rooms = state.rooms.filter(r => r.id !== id)

            const { offset, limit, total } = state.roomsPagination
            const remainingItems = total - 1

            const isPageEmpty = offset >= remainingItems && offset !== 0
            if (isPageEmpty) {
              state.roomsPagination.offset = offset - limit
            }

            state.roomsPagination.total = remainingItems
          }, false, 'ROOM/DELETE_ROOM_SUCCESS')

          useToastStore.getState().showToast(message || 'Room deleted successfully.', 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error deleting room', 'error')
          }
        }
      },
    })),

    { name: 'roomStore' }
  )
)

