import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IGameSessionStore } from '../types/game-sessions/gameSession.store'
import { CreateGameSessionRequest, UpdateGameSessionRequest, UpdateGameSessionConfigRequest } from '../types/game-sessions/gameSession.api'
import { useToastStore } from '../../../store/useToastStore'
import { GameSessionListItem, GameSession } from '../types/game-sessions/gameSession.models'
import { getUserGameSessions, getGameSessionById, createGameSession, updateGameSession, updateGameSessionConfig, deleteGameSession } from '../api/GameSessions'

export const useGameSessionStore = create<IGameSessionStore>()(
  devtools(
    immer((set, get) => ({
      gameSessions: [],
      selectedGameSession: null,
      isLoading: false,

      gameSessionsPagination: {
        total: 0,
        offset: 0,
        limit: 10,
      },

      setGameSessions: (gameSessions: GameSessionListItem[]) => {
        set((state) => {
          state.gameSessions = gameSessions
        }, false, 'GAME_SESSION/SET_SESSIONS')
      },

      setSelectedGameSession: (gameSession: GameSession | null) => {
        set((state) => {
          state.selectedGameSession = gameSession
        }, false, 'GAME_SESSION/SET_SELECTED')
      },

      setGameSessionsOffset: (offset: number) => {
        set((state) => {
          state.gameSessionsPagination.offset = offset
        }, false, 'GAME_SESSION/SET_OFFSET')
      },

      setGameSessionsLimit: (limit: number) => {
        set((state) => {
          state.gameSessionsPagination.limit = limit
        }, false, 'GAME_SESSION/SET_LIMIT')
      },

      setGameSessionsTotal: (total: number) => {
        set((state) => {
          state.gameSessionsPagination.total = total
        }, false, 'GAME_SESSION/SET_TOTAL')
      },

      fetchGameSessions: async (offset?: number, limit?: number) => {
        const currentOffset = offset ?? get().gameSessionsPagination.offset
        const currentLimit = limit ?? get().gameSessionsPagination.limit

        set((state) => {
          state.isLoading = true
        }, false, 'GAME_SESSION/FETCH_REQUEST')

        try {
          const { data, total } = await getUserGameSessions(currentOffset, currentLimit)

          get().setGameSessions(data)
          get().setGameSessionsTotal(total)
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error fetching game sessions', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'GAME_SESSION/FETCH_COMPLETE')
        }
      },

      getGameSessionById: async (id: string) => {
        set((state) => {
          state.isLoading = true
        }, false, 'GAME_SESSION/FETCH_BY_ID_REQUEST')

        try {
          const { data } = await getGameSessionById(id)
          get().setSelectedGameSession(data)
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error fetching game session', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'GAME_SESSION/FETCH_BY_ID_COMPLETE')
        }
      },

      createGameSession: async (sessionData: CreateGameSessionRequest) => {
        set((state) => {
          state.isLoading = true
        }, false, 'GAME_SESSION/CREATE_REQUEST')

        try {
          const { data, message } = await createGameSession(sessionData)
          useToastStore.getState().showToast(message || 'Game session created successfully!', 'success')

          const newSessionListItem: GameSessionListItem = {
            id: data.id,
            name: data.name,
            status: data.status,
            createdAt: data.createdAt,
            currentRound: data.currentRound || 1,
            totalScore: data.totalScore || 0,
            totalRounds: data.config?.totalRounds || sessionData.config.total_rounds,
          }

          set((state) => {
            state.gameSessions = [newSessionListItem, ...state.gameSessions]
            state.gameSessionsPagination.total += 1
          }, false, 'GAME_SESSION/ADD_NEW')
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error creating game session', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'GAME_SESSION/CREATE_COMPLETE')
        }
      },

      updateGameSession: async (id: string, sessionData: UpdateGameSessionRequest) => {
        set((state) => {
          state.isLoading = true
        }, false, 'GAME_SESSION/UPDATE_REQUEST')

        try {
          const { message } = await updateGameSession(id, sessionData)
          useToastStore.getState().showToast(message || 'Game session updated successfully!', 'success')

          get().fetchGameSessions()
          
          if (get().selectedGameSession?.id === id) {
            await get().getGameSessionById(id)
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message, 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'GAME_SESSION/UPDATE_COMPLETE')
        }
      },

      updateGameSessionConfig: async (id: string, sessionData: UpdateGameSessionConfigRequest) => {
        set((state) => {
          state.isLoading = true
        }, false, 'GAME_SESSION/UPDATE_CONFIG_REQUEST')

        try {
          const { message } = await updateGameSessionConfig(id, sessionData)
          useToastStore.getState().showToast(message || 'Game session configuration updated successfully!', 'success')

          get().fetchGameSessions()
          
          if (get().selectedGameSession?.id === id) {
            await get().getGameSessionById(id)
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error updating game session', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'GAME_SESSION/UPDATE_CONFIG_COMPLETE')
        }
      },

      deleteGameSession: async (id: string) => {
        try {
          const { message } = await deleteGameSession(id)

          set((state) => {
            state.gameSessions = state.gameSessions.filter(s => s.id !== id)

            const { offset, limit, total } = state.gameSessionsPagination
            const remainingItems = total - 1

            const isPageEmpty = offset >= remainingItems && offset !== 0
            if (isPageEmpty) {
              state.gameSessionsPagination.offset = offset - limit
            }

            state.gameSessionsPagination.total = remainingItems
          }, false, 'GAME_SESSION/DELETE_SUCCESS')

          useToastStore.getState().showToast(message || 'Game session deleted successfully.', 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error deleting game session', 'error')
          }
        }
      },
    })),

    { name: 'gameSessionStore' }
  )
)

