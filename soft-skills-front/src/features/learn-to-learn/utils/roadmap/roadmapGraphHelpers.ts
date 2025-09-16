import { LayoutNodeType } from '../../types/roadmap/roadmap.enums'
import { LayoutEdge, LayoutNode, Objective, ObjectiveNodeData, Task } from '../../types/roadmap/roadmap.models'
import { isObjectiveNode } from './roadmapNodeTypeUtils'

/**
 * Finds a node by ID from a list of nodes.
 *
 * @param nodes - The list of layout nodes.
 * @param nodeId - The ID of the node to find.
 * @returns The node with the specified ID, or undefined if not found.
 */
export function findNodeById(nodes: LayoutNode[], nodeId: string): LayoutNode | undefined {
  return nodes.find(n => n.id === nodeId)
}

/**
 * Finds the index of a node by its ID.
 *
 * @param nodes - The list of layout nodes.
 * @param nodeId - The ID of the node to find.
 * @returns The index of the node, or -1 if not found.
 */
export function findNodeIndexById(nodes: LayoutNode[], nodeId: string): number {
  return nodes.findIndex(n => n.id === nodeId)
}

/**
 * Finds the edge where the given node ID matches the specified direction (source or target).
 *
 * @param edges - Array of edges to search in.
 * @param nodeId - The node ID to match against.
 * @param match - Whether to match the node ID as 'source', 'target', or 'any'. Defaults to 'target'.
 * @returns The first edge that matches the condition, or undefined if not found.
 */
export function findEdgeByNodeId(
  edges: LayoutEdge[],
  nodeId: string,
  match: 'source' | 'target' | 'any' = 'target'
): LayoutEdge | undefined {
  return edges.find(edge => {
    if (match === 'source') return edge.source === nodeId
    if (match === 'target') return edge.target === nodeId
    return edge.source === nodeId || edge.target === nodeId
  })
}

/**
 * Filters out a node by ID from a list.
 *
 * @param nodes - The list of layout nodes.
 * @param nodeId - The ID of the node to remove.
 * @returns A new array of nodes excluding the specified one.
 */
export function removeNodeById(nodes: LayoutNode[], nodeId: string): LayoutNode[] {
  return nodes.filter(n => n.id !== nodeId)
}

/**
 * Filters out all edges connected to a given node ID (either as source or target).
 *
 * @param edges - The list of layout edges.
 * @param nodeId - The ID of the node to disconnect.
 * @returns A new array of edges not connected to the specified node.
 */
export function removeEdgesConnectedToNode(edges: LayoutEdge[], nodeId: string): LayoutEdge[] {
  return edges.filter(e => e.source !== nodeId && e.target !== nodeId)
}

/**
 * Removes all nodes that match any of the given IDs.
 *
 * @param nodes - The array of nodes to filter.
 * @param idsToRemove - The array of node IDs to remove.
 * @returns A filtered array of nodes excluding those with matching IDs.
 */
export function removeNodesByIds(nodes: LayoutNode[], idsToRemove: string[]): LayoutNode[] {
  return nodes.filter(n => !idsToRemove.includes(n.id))
}

/**
 * Removes all edges where either the source or target matches any of the given IDs.
 *
 * @param edges - The array of edges to filter.
 * @param idsToRemove - The array of node IDs to disconnect from edges.
 * @returns A filtered array of edges not connected to any of the specified node IDs.
 */
export function removeEdgesByIds(edges: LayoutEdge[], idsToRemove: string[]): LayoutEdge[] {
  return edges.filter(e => !idsToRemove.includes(e.source) && !idsToRemove.includes(e.target))
}

/**
 * Updates the `totalTasks` field in the objective node if found.
 *
 * @param nodes - The list of editor nodes.
 * @param objectiveId - The ID of the objective node.
 * @param newTaskCount - The new number of tasks to assign.
 */
export function updateObjectiveTaskCount(
  nodes: LayoutNode[],
  objectiveId: string,
  newTaskCount: number
): void {
  const objectiveNode = findNodeById(nodes, objectiveId)
  if (!objectiveNode) return

  if (isObjectiveNode(objectiveNode)) {
    const data = objectiveNode.data as ObjectiveNodeData
    data.totalTasks = newTaskCount
  }
}

/**
 * Creates a new Objective object based on a layout node.
 *
 * This is typically used when a new objective node is added to the roadmap
 * via a connection or drag-and-drop action.
 *
 * @param node - The layout node representing the new objective.
 * @returns A newly constructed Objective with default values.
 */
export function createObjectiveFromNode(node: LayoutNode): Objective {
  return {
    objectiveId: node.id,
    title: node.data.title as string,
    orderIndex: 0,
    tasks: [],
  }
}

/**
 * Creates a new Task object based on a layout node.
 *
 * Typically used when a task node is added to an objective through a connection.
 *
 * @param node - The layout node representing the task.
 * @returns A newly constructed Task with default values.
 */
export function createTaskFromNode(node: LayoutNode): Task {
  return {
    taskId: node.id,
    title: node.data.title as string,
    orderIndex: 0,
    resources: [],
  }
}

/**
 * Returns true if the node has an outgoing connection to another objective node.
 */
export function hasOutgoingConnectionToObjective(
  sourceId: string,
  edges: LayoutEdge[],
  nodes: LayoutNode[]
): boolean {
  return edges.some(edge => {
    if (edge.source !== sourceId) return false

    const targetNode = findNodeById(nodes, edge.target)
    return targetNode?.type === LayoutNodeType.Objective
  })
}

/**
 * Returns true if the node has an incoming connection from another objective node.
 */
export function hasIncomingConnectionFromObjective(
  targetId: string,
  edges: LayoutEdge[],
  nodes: LayoutNode[]
): boolean {
  return edges.some(edge => {
    if (edge.target !== targetId) return false

    const sourceNode = findNodeById(nodes, edge.source)
    return sourceNode?.type === LayoutNodeType.Objective
  })
}

/**
 * Safely extracts the title from a node's data if it's a valid string.
 *
 * @param node - The layout node to extract the title from.
 * @returns The title if it's a string, otherwise null.
 */
export function getNodeTitle(node: LayoutNode): string | null {
  const title = node.data?.title
  return typeof title === 'string' ? title : null
}