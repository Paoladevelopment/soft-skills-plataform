import { LayoutNodeType } from "../../types/roadmap/roadmap.enums"
import { LayoutNode } from "../../types/roadmap/roadmap.models"

/**
 * Checks if the given node is an Objective node.
 */
export function isObjectiveNode(node: LayoutNode): boolean {
  return node.type === LayoutNodeType.Objective
}

/**
 * Checks if the given node is a Task node.
 */
export function isTaskNode(node: LayoutNode): boolean {
  return node.type === LayoutNodeType.Task
}

/**
 * Checks if both nodes are Objective nodes.
 */
export function isObjectiveToObjectiveConnection(source: LayoutNode, target: LayoutNode): boolean {
  return isObjectiveNode(source) && isObjectiveNode(target)
}

/**
 * Checks if the source is an Objective and the target is a Task.
 */
export function isObjectiveToTaskConnection(source: LayoutNode, target: LayoutNode): boolean {
  return isObjectiveNode(source) && isTaskNode(target)
}
