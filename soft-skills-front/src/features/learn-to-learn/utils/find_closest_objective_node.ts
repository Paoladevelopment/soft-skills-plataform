import { Node } from 'reactflow'

/**
 * Finds the closest objective node to a given node (by horizontal X distance).
 *
 * @param nodes - A Map of node internals from React Flow
 * @param targetPosition - The position of the node we’re comparing against
 * @returns The closest objective node (or undefined if none found)
 */
export function findClosestObjectiveNode(
  nodes: Map<string, Node>,
  targetPosition: { x: number; y: number } | undefined
): Node | undefined {
  if (!targetPosition) return undefined

  return Array.from(nodes.values())
    .filter((n) => n.type === 'objectiveNode')
    .reduce<Node | undefined>((closest, objectiveNode) => {
      if (!objectiveNode.position) return closest

      const distance = Math.abs(objectiveNode.position.x - targetPosition.x)

      if (!closest || distance < Math.abs(closest.position.x - targetPosition.x)) {
        return objectiveNode
      }

      return closest
    }, undefined)
}
