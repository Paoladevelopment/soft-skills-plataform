import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IGameSessionStore } from '../types/game-sessions/gameSession.store'
import { CreateGameSessionRequest, UpdateGameSessionRequest, UpdateGameSessionConfigRequest } from '../types/game-sessions/gameSession.api'
import { useToastStore } from '../../../store/useToastStore'
import { GameSessionListItem, GameSession, GameSessionStatus } from '../types/game-sessions/gameSession.models'
import { getUserGameSessions, getGameSessionById, createGameSession, updateGameSession, updateGameSessionConfig, deleteGameSession, startGameSession } from '../api/GameSessions'
import i18n from '../../../i18n/config'

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
            const message = err.message || i18n.t('toasts.sessions.fetchError', { ns: 'game' })
            useToastStore.getState().showToast(message, 'error')
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
            const message = err.message || i18n.t('toasts.sessions.fetchByIdError', { ns: 'game' })
            useToastStore.getState().showToast(message, 'error')
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
          const successMessage = message || i18n.t('toasts.sessions.createSuccess', { ns: 'game' })
          useToastStore.getState().showToast(successMessage, 'success')

          const newSessionListItem: GameSessionListItem = {
            gameSessionId: data.gameSessionId,
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
            const errorMessage = err.message || i18n.t('toasts.sessions.createError', { ns: 'game' })
            useToastStore.getState().showToast(errorMessage, 'error')
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
          const successMessage = message || i18n.t('toasts.sessions.updateSuccess', { ns: 'game' })
          useToastStore.getState().showToast(successMessage, 'success')

          get().fetchGameSessions()
          
          if (get().selectedGameSession?.gameSessionId === id) {
            await get().getGameSessionById(id)
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('toasts.sessions.updateError', { ns: 'game' })
            useToastStore.getState().showToast(errorMessage, 'error')
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
          const successMessage = message || i18n.t('toasts.sessions.updateConfigSuccess', { ns: 'game' })
          useToastStore.getState().showToast(successMessage, 'success')

          get().fetchGameSessions()
          
          if (get().selectedGameSession?.gameSessionId === id) {
            await get().getGameSessionById(id)
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('toasts.sessions.updateConfigError', { ns: 'game' })
            useToastStore.getState().showToast(errorMessage, 'error')
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
            state.gameSessions = state.gameSessions.filter(s => s.gameSessionId !== id)

            const { offset, limit, total } = state.gameSessionsPagination
            const remainingItems = total - 1

            const isPageEmpty = offset >= remainingItems && offset !== 0
            if (isPageEmpty) {
              state.gameSessionsPagination.offset = offset - limit
            }

            state.gameSessionsPagination.total = remainingItems
          }, false, 'GAME_SESSION/DELETE_SUCCESS')

          const successMessage = message || i18n.t('toasts.sessions.deleteSuccess', { ns: 'game' })
          useToastStore.getState().showToast(successMessage, 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('toasts.sessions.deleteError', { ns: 'game' })
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        }
      },

      startGameSession: async (id: string) => {
        set((state) => {
          state.isLoading = true
        }, false, 'GAME_SESSION/START_REQUEST')

        try {
          const response = await startGameSession(id)
          
          const successMessage = i18n.t('toasts.sessions.startSuccess', { ns: 'game' })
          useToastStore.getState().showToast(successMessage, 'success')

          set((state) => {
            if (response) {
              const sessionIndex = state.gameSessions.findIndex(s => s.gameSessionId === id)
              if (sessionIndex !== -1) {
                state.gameSessions[sessionIndex].status = response.status as GameSessionStatus
              }
            }
          }, false, 'GAME_SESSION/START_UPDATE_LIST')

          return response
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('toasts.sessions.startError', { ns: 'game' })
            useToastStore.getState().showToast(errorMessage, 'error')
          }
          
          return undefined
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'GAME_SESSION/START_COMPLETE')
        }
      },
    })),

    { name: 'gameSessionStore' }
  )
)

