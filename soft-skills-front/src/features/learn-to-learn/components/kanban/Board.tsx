import { Box } from '@mui/material'
import { ObjectiveBoard } from '../../types/kanban/board.types'
import { 
  getDataType,
  OnDropArgs,
  DropTargetRecord,
  ColumnModel,
  Task
} from '../../types/kanban/drag-drop.types'
import {
  findColumnById,
  findTaskIndexById,
  updateColumnTasks,
  removeTaskFromColumn,
  insertTaskAtPosition,
  asCardData,
  columnIdFrom
} from '../../utils/kanbanUtils'
import Column from './Column'
import { useEffect, useCallback, useState } from 'react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index'
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder'
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'

interface BoardProps {
  board: ObjectiveBoard
  moveTask: (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    newPosition: number,
    reason?: string
  ) => void
}


const Board = ({ board, moveTask }: BoardProps) => {
  const [columnsData, setColumnsData] = useState<ObjectiveBoard>(board)

  useEffect(() => {
    setColumnsData(board)
  }, [board])

  const reorderCard = useCallback(
    (
      { columnId, startIndex, finishIndex }: 
      { columnId: string; startIndex: number; finishIndex: number }
    ) => {
      const sourceColumn = findColumnById(columnsData.columns, columnId)
      if (!sourceColumn) return

      const taskToMove = sourceColumn.tasks[startIndex]
      if (!taskToMove) return

      const updatedItems = reorder<Task>({
        list: sourceColumn.tasks,
        startIndex,
        finishIndex,
      })

      const updatedColumns = updateColumnTasks(columnsData.columns, columnId, updatedItems)

      setColumnsData(prev => ({ ...prev, columns: updatedColumns }))

      moveTask(
        taskToMove.id,
        columnId,
        columnId,
        finishIndex,
        'Task reordered within column'
      )
    },
    [columnsData, moveTask]
  )

  const moveCard = useCallback(
    (args: {
      movedCardIndexInSourceColumn: number
      sourceColumnId: string
      destinationColumnId: string
      movedCardIndexInDestinationColumn: number
    }) => {
      const { 
        movedCardIndexInSourceColumn, 
        sourceColumnId, 
        destinationColumnId, 
        movedCardIndexInDestinationColumn 
      } = args

      const sourceColumn = findColumnById(columnsData.columns, sourceColumnId)
      const destinationColumn = findColumnById(columnsData.columns, destinationColumnId)
      if (!sourceColumn || !destinationColumn) return

      const cardToMove = sourceColumn.tasks[movedCardIndexInSourceColumn]
      if (!cardToMove) return

      const newSourceTasks = removeTaskFromColumn(sourceColumn.tasks, cardToMove.id)
      const newDestinationTasks = insertTaskAtPosition(destinationColumn.tasks, cardToMove, movedCardIndexInDestinationColumn)

      const updatedColumns = columnsData.columns.map(col => {
        if (col.id === sourceColumnId) return { ...col, tasks: newSourceTasks }
        if (col.id === destinationColumnId) return { ...col, tasks: newDestinationTasks }

        return col
      })

      setColumnsData(prev => ({ ...prev, columns: updatedColumns }))

      const reason = sourceColumnId === destinationColumnId 
        ? 'Task reordered within column' 
        : `Task moved from ${sourceColumn.title} to ${destinationColumn.title}`
      
      moveTask(
        cardToMove.id,
        sourceColumnId,
        destinationColumnId,
        movedCardIndexInDestinationColumn,
        reason
      )
    },
    [columnsData, moveTask]
  )

  const getSourceColumnData = useCallback(
    (location: OnDropArgs['location']): { 
      sourceColumnId: string
      sourceColumn: ColumnModel | undefined 
    } => {
      const [, sourceColumnRecord] = location.initial.dropTargets
      const sourceColumnId = columnIdFrom(sourceColumnRecord)
      const sourceColumn = findColumnById(columnsData.columns, sourceColumnId)
      
      return { sourceColumnId, sourceColumn }
    },
    [columnsData.columns]
  )

  const handleColumnDrop = useCallback(
    (sourceColumnId: string, destinationColumnId: string, draggedCardIndex: number) => {
      if (sourceColumnId === destinationColumnId) {
        const sourceColumn = findColumnById(columnsData.columns, sourceColumnId)
        if (!sourceColumn) return

        const destinationIndex = getReorderDestinationIndex({
          startIndex: draggedCardIndex,
          indexOfTarget: sourceColumn.tasks.length - 1,
          closestEdgeOfTarget: null,
          axis: 'vertical',
        })

        reorderCard({ columnId: sourceColumnId, startIndex: draggedCardIndex, finishIndex: destinationIndex })
      } else {
        moveCard({
          movedCardIndexInSourceColumn: draggedCardIndex,
          sourceColumnId,
          destinationColumnId,
          movedCardIndexInDestinationColumn: 0,
        })
      }
    },
    [columnsData.columns, reorderCard, moveCard]
  )

  const handleCardDrop = useCallback(
    (
      sourceColumnId: string,
      destinationColumnId: string,
      draggedCardIndex: number,
      destinationCardId: string,
      recordForEdge: DropTargetRecord
    ) => {
      const destinationColumn = findColumnById(columnsData.columns, destinationColumnId)
      if (!destinationColumn) return

      const indexOfTarget = findTaskIndexById(destinationColumn.tasks, destinationCardId)
      if (indexOfTarget < 0) return

      const closestEdgeOfTarget = extractClosestEdge(asCardData(recordForEdge.data))

      if (sourceColumnId === destinationColumnId) {
        const destinationIndex = getReorderDestinationIndex({
          startIndex: draggedCardIndex,
          indexOfTarget,
          closestEdgeOfTarget,
          axis: 'vertical',
        })

        reorderCard({ columnId: sourceColumnId, startIndex: draggedCardIndex, finishIndex: destinationIndex })
      } else {
        const destinationIndex = closestEdgeOfTarget === 'bottom' ? indexOfTarget + 1 : indexOfTarget

        moveCard({
          movedCardIndexInSourceColumn: draggedCardIndex,
          sourceColumnId,
          destinationColumnId,
          movedCardIndexInDestinationColumn: destinationIndex,
        })
      }
    },
    [columnsData.columns, reorderCard, moveCard]
  )

  const handleDrop = useCallback(
    ({ source, location }: OnDropArgs) => {
      const targets = location.current.dropTargets
      if (!targets.length) return

      if (getDataType(source.data) !== 'card') return
      const dragged = asCardData(source.data)
      const draggedCardId = dragged.cardId

      const { sourceColumnId, sourceColumn } = getSourceColumnData(location)
      if (!sourceColumn) return

      const draggedCardIndex = findTaskIndexById(sourceColumn.tasks, draggedCardId)
      if (draggedCardIndex < 0) return

      // 1 target: dropping into empty column/space
      if (targets.length === 1) {
        const destinationColumnId = columnIdFrom(targets[0])
        handleColumnDrop(sourceColumnId, destinationColumnId, draggedCardIndex)
        return
      }

      // 2 targets: dropping on another card
      if (targets.length === 2) {
        const [a, b] = targets
        const aIsCard = getDataType(a.data) === 'card'
        const cardRecord = aIsCard ? a : b
        const columnRecord = aIsCard ? b : a

        const destinationColumnId = columnIdFrom(columnRecord)
        const destinationCardId = asCardData(cardRecord.data).cardId

        handleCardDrop(sourceColumnId, destinationColumnId, draggedCardIndex, destinationCardId, cardRecord)
      }
    },
    [getSourceColumnData, handleColumnDrop, handleCardDrop]
  )

  useEffect(() => monitorForElements({ onDrop: handleDrop }), [handleDrop])

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        px: 1,
        pb: 2,
        overflow: 'auto',
        minHeight: '400px',
        maxHeight: '600px',
        '&::-webkit-scrollbar': { 
          height: 6 
        },
        '&::-webkit-scrollbar-track': { 
          backgroundColor: '#f1f1f1', 
          borderRadius: 3 
        },
        '&::-webkit-scrollbar-thumb': { 
          backgroundColor: '#c1c1c1', 
          borderRadius: 3, 
          '&:hover': { 
            backgroundColor: '#a8a8a8' 
          } 
        },
        backgroundColor: '#ffffff',
      }}
    >
      {columnsData.columns.map(column => (
        <Column key={column.id} column={column} />
      ))}
    </Box>
  )
}

export default Board
