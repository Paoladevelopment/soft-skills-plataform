
export type CardData = { 
  type: 'card'
  cardId: string
  columnId: string
  index: number
}

export type ColumnData = { 
  type: 'column'
  columnId: string
}

export const isCardData = (data: unknown): data is CardData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    (data as Record<string, unknown>).type === 'card' &&
    'cardId' in data &&
    'columnId' in data &&
    'index' in data
  )
}

export const isColumnData = (data: unknown): data is ColumnData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    (data as Record<string, unknown>).type === 'column' &&
    'columnId' in data
  )
}


export const getDataType = (x: unknown): string | undefined => {
  if (typeof x !== 'object' || x === null) return undefined

  if (!('type' in x)) return undefined

  const t = (x as { type?: unknown }).type
  
  return typeof t === 'string' ? t : undefined
}

// Pragmatic Drag and Drop related types
export type MonitorOptions = Parameters<typeof import('@atlaskit/pragmatic-drag-and-drop/element/adapter').monitorForElements>[0]
export type OnDropArgs = Parameters<NonNullable<MonitorOptions['onDrop']>>[0]
export type DropTargetRecord = OnDropArgs['location']['current']['dropTargets'][number]

// Board model types
export type ColumnModel = import('./board.types').ObjectiveBoard['columns'][number]
export type Task = ColumnModel['tasks'][number]
