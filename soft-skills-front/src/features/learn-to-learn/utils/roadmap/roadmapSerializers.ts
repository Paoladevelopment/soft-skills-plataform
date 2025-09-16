import { LayoutNodeType } from "../../types/roadmap/roadmap.enums"
import { LayoutNode, ObjectiveNodeData } from "../../types/roadmap/roadmap.models"

/**
 * Normalizes layout nodes by transforming camelCase frontend fields 
 * to the snake_case structure expected by the backend.
 * 
 * Specifically:
 * - Converts `totalTasks` → `total_tasks` (only for ObjectiveNode types)
 * - Omits `isEditable` field (not stored in backend)
 * - Preserves `position`, `width`, `height`, and other visual config fields
 * 
 * @param {LayoutNode[]} nodes - The list of layout nodes to normalize
 * @returns {Array} Normalized nodes with backend-compatible structure
 */
export function normalizeLayoutNodes(nodes: LayoutNode[]) {
  return nodes.map((node) => {
    const { id, type, position, data } = node

    const totalTasks = type === LayoutNodeType.Objective? (data as ObjectiveNodeData).totalTasks ?? 0: undefined

    const cleanData = {
      title: data.title,
      totalTasks: totalTasks,
      fontSize: data.fontSize,
      backgroundColor: data.backgroundColor,
      width: data.width,
      height: data.height,
    }

    return {
      id,
      type,
      position,
      data: cleanData,
    }
  })
}