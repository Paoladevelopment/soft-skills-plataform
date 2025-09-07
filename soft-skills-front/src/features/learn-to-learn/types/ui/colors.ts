/**
 * Color constants for UI components
 */

// Priority colors
export const PRIORITY_COLORS = {
  HIGH: 'error',
  MEDIUM: 'warning', 
  LOW: 'default'
} as const

// Status colors
export const STATUS_COLORS = {
  COMPLETED: 'success',
  IN_PROGRESS: 'info',
  PAUSED: 'warning',
  NOT_STARTED: 'default'
} as const

// Type for priority colors
export type PriorityColor = typeof PRIORITY_COLORS[keyof typeof PRIORITY_COLORS]

// Type for status colors
export type StatusColor = typeof STATUS_COLORS[keyof typeof STATUS_COLORS]

// Union type for all priority color values
export type PriorityColorValue = 'error' | 'warning' | 'default'

// Union type for all status color values
export type StatusColorValue = 'success' | 'info' | 'warning' | 'default'

// Union type for all chip colors
export type ChipColorValue = PriorityColorValue | StatusColorValue
