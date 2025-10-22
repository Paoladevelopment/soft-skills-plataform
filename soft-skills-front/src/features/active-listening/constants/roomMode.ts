export const ROOM_MODE = {
  CREATE: 'create',
  UPDATE: 'update',
} as const

export type RoomMode = typeof ROOM_MODE[keyof typeof ROOM_MODE]

