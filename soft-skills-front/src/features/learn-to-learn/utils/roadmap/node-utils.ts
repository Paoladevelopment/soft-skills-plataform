import { LayoutNodeType } from '../../types/roadmap/roadmap.enums'
import { LayoutNode } from '../../types/roadmap/roadmap.models'
import { v4 as uuid } from 'uuid'


/**
 * Creates a new layout node (Objective or Task) with default editable data and a unique ID.
 *
 * @param type - The type of node to create (Objective or Task).
 * @param position - The initial (x, y) position of the node on the canvas.
 * @returns A new `LayoutNode` with pre-filled properties.
 */
export function createNode(type: LayoutNodeType, position: { x: number; y: number }): LayoutNode {
  return {
    id: uuid(),
    type,
    position,
    data: {
      title: type === LayoutNodeType.Objective ? 'New Objective' : 'New Task',
      isEditable: true,
      ...(type === LayoutNodeType.Objective ? { total_tasks: 0 } : {}),
    },
  }
}
