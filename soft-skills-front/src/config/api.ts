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
    getObjectives: (id: string) => `${BASE_URL}/learning-goals/${id}/objectives`
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
}
