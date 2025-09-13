export type ColumnColorScheme = {
  bg: string
  border: string
  chipColor: 'default' | 'info' | 'success' | 'warning'
}

const TODO_COLORS: ColumnColorScheme = {
  bg: '#f8f9fa',
  border: '#e9ecef',
  chipColor: 'default'
}

const IN_PROGRESS_COLORS: ColumnColorScheme = {
  bg: '#e3f2fd',
  border: '#bbdefb',
  chipColor: 'info'
}

const DONE_COLORS: ColumnColorScheme = {
  bg: '#e8f5e8',
  border: '#c8e6c9',
  chipColor: 'success'
}

const PAUSED_COLORS: ColumnColorScheme = {
  bg: '#fff3e0',
  border: '#ffcc02',
  chipColor: 'warning'
}

const DEFAULT_COLORS: ColumnColorScheme = {
  bg: '#f8f9fa',
  border: '#e9ecef',
  chipColor: 'default'
}

/**
 * Gets the color scheme for a column based on its ID
 */
export const getColumnColor = (columnId: string): ColumnColorScheme => {
  switch (columnId) {
    case 'todo':
      return TODO_COLORS
    case 'in-progress':
      return IN_PROGRESS_COLORS
    case 'done':
      return DONE_COLORS
    case 'paused':
      return PAUSED_COLORS
    default:
      return DEFAULT_COLORS
  }
}
