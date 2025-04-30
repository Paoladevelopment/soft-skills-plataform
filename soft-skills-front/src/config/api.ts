import { environment } from "./env"

const BASE_URL = environment.API_BASE_URL

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
  }
}
