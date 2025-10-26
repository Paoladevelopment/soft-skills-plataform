export const GAME_SESSION_MODE = {
  CREATE: 'create',
  UPDATE: 'update',
} as const

export type GameSessionMode = typeof GAME_SESSION_MODE[keyof typeof GAME_SESSION_MODE]

