import { environment } from "./env"

const BASE_URL = environment.API_BASE_URL
const CHATBOT_BASE_URL = environment.CHATBOT_BASE_URL

// Auto-save configuration
export const AUTO_SAVE_DELAY = 750 

export const api = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
  },
  learningGoals: {
    create: `${BASE_URL}/learning-goals`,
    getAllByUser: `${BASE_URL}/users/me/learning-goals`,
    byId: (id: string) => `${BASE_URL}/learning-goals/${id}`,
    getObjectives: (id: string) => `${BASE_URL}/learning-goals/${id}/objectives`,
    convertToRoadmap: (id: string) => `${BASE_URL}/learning-goals/${id}/convert-to-roadmap`
  },
  objectives: {
    create: `${BASE_URL}/objectives`,
    byId: (id: string) => `${BASE_URL}/objectives/${id}`,
    delete: (id: string) => `${BASE_URL}/objectives/${id}`,
    kanban: (id: string) => `${BASE_URL}/objectives/${id}/kanban`,
    moveTask: (id: string) => `${BASE_URL}/objectives/${id}/kanban/move`
  },
  roadmap: {
    create: `${BASE_URL}/roadmap`,
    getMine: `${BASE_URL}/roadmap/mine`,
    getPublic: `${BASE_URL}/roadmap/public`,
    byId: (id: string) => `${BASE_URL}/roadmap/${id}`
  },
  chatbot: {
    chat: (threadId?: string) =>
      `${CHATBOT_BASE_URL}/chat${threadId ? `?thread_id=${threadId}` : ""}`,
  },
  pomodoroPreferences: {
    get: `${BASE_URL}/users/me/pomodoro-preferences`,
    createOrUpdate: `${BASE_URL}/users/me/pomodoro-preferences`,
  },
  tasks: {
    create: `${BASE_URL}/tasks`,
    byId: (id: string) => `${BASE_URL}/tasks/${id}`,
    update: (id: string) => `${BASE_URL}/tasks/${id}`,
    delete: (id: string) => `${BASE_URL}/tasks/${id}`,
  },
  modules: {
    getAll: `${BASE_URL}/modules`,
  },
  gameSessions: {
    getAll: (offset: number, limit: number) => `${BASE_URL}/game-sessions?offset=${offset}&limit=${limit}`,
    byId: (id: string) => `${BASE_URL}/game-sessions/${id}`,
    create: `${BASE_URL}/game-sessions`,
    update: (id: string) => `${BASE_URL}/game-sessions/${id}`,
    updateConfig: (id: string) => `${BASE_URL}/game-sessions/${id}/config`,
    delete: (id: string) => `${BASE_URL}/game-sessions/${id}`,
    start: (id: string) => `${BASE_URL}/game-sessions/${id}/start`,
    finish: (id: string) => `${BASE_URL}/game-sessions/${id}/finish`,
    result: (id: string) => `${BASE_URL}/game-sessions/${id}/result`,
    rounds: {
      current: (sessionId: string) => `${BASE_URL}/game-sessions/${sessionId}/rounds/current`,
      attempt: (sessionId: string, roundNumber: number) => `${BASE_URL}/game-sessions/${sessionId}/rounds/${roundNumber}/attempt`,
      next: (sessionId: string) => `${BASE_URL}/game-sessions/${sessionId}/rounds/next`,
      replay: (sessionId: string, roundNumber: number) => `${BASE_URL}/game-sessions/${sessionId}/rounds/${roundNumber}/audio/replay`,
    }
  }
}
