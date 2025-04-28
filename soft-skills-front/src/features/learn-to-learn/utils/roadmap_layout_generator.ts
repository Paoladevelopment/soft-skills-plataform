import { LayoutNodeType } from "../types/roadmap/roadmap.enums"
import { Objective, Task, LayoutNode, LayoutEdge, Roadmap } from "../types/roadmap/roadmap.models"

// Constants
const NODE_WIDTH = 250
const NODE_PADDING_Y = 32 // 16px * 2
const TASK_PADDING_Y = 16 // 8px * 2
const SPACING_BETWEEN_TASKS = 25
const HORIZONTAL_SPACING = NODE_WIDTH + 100
const OBJECTIVE_TO_TASK_SPACING = 75

// --------------------------
// Helpers (auxiliary functions)
// --------------------------

/**
 * Estimates the height needed to render an Objective node.
 * 
 * @example 
 * estimateObjectiveHeight({ title: 'Title', description: 'Some text', tasks: [] })
 */
function estimateObjectiveHeight(objective: Objective): number {
  const averageCharactersPerLine = 30
  const titleLines = Math.ceil(objective.title.length / averageCharactersPerLine);
  const titleHeight = titleLines * 24

  const descriptionLines = objective.description ? Math.ceil(objective.description.length / averageCharactersPerLine) : 0;
  const descHeight = descriptionLines * 20

  const tasksInfoHeight = 18 // Fixed for "Tasks: X"

  return NODE_PADDING_Y + titleHeight + descHeight + tasksInfoHeight
}

/**
 * Estimates the height needed to render a Task node.
 * 
 * @example 
 * estimateTaskHeight({ title: 'Short title' }) 
 */
function estimateTaskHeight(task: Task): number {
  const averageCharactersPerLine = 30
  const lines = Math.ceil(task.title.length / averageCharactersPerLine)

  const lineHeight = 24
  return TASK_PADDING_Y + (lines * lineHeight)
}

/**
 * Sorts objectives by order_index ascending.
 */
function sortObjectives(objectives: Objective[]): Objective[] {
  return [...objectives].sort((a, b) => a.order_index - b.order_index);
}

/**
 * Splits a task array into two arrays: left side and right side.
 * 
 * @example
 * splitTasks([task1, task2, task3]) -> { leftTasks: [task1, task2], rightTasks: [task3] }
 */
function splitTasks(tasks: Task[]): { leftTasks: Task[], rightTasks: Task[] } {
  const middle = Math.ceil(tasks.length / 2);
  return {
    leftTasks: tasks.slice(0, middle),
    rightTasks: tasks.slice(middle),
  }
}

/**
 * Calculates the block height and vertical positioning for an objective and its tasks.
 *
 * @returns An object with blockTopY, blockCenterY, blockHeight, objectiveY
 * 
 * @example
 * calculateObjectiveVerticalLayout(previousBottomY, objective, leftTasks, rightTasks)
 */
function calculateObjectiveVerticalLayout(
  previousBottomY: number,
  objective: Objective,
  leftTasks: Task[],
  rightTasks: Task[],
): { blockTopY: number; blockCenterY: number; blockHeight: number; objectiveY: number } {
  const objectiveHeight = estimateObjectiveHeight(objective)

  const leftTasksHeight = leftTasks.reduce(
    (acc, task) => acc + estimateTaskHeight(task) + SPACING_BETWEEN_TASKS,
    -SPACING_BETWEEN_TASKS
  )

  const rightTasksHeight = rightTasks.reduce(
    (acc, task) => acc + estimateTaskHeight(task) + SPACING_BETWEEN_TASKS,
    -SPACING_BETWEEN_TASKS
  )

  const tasksBlockHeight = Math.max(leftTasksHeight, rightTasksHeight)
  const blockHeight = Math.max(objectiveHeight, tasksBlockHeight)

  const blockTopY = previousBottomY + OBJECTIVE_TO_TASK_SPACING
  const blockCenterY = blockTopY + blockHeight / 2
  const objectiveY = blockCenterY - objectiveHeight / 2

  return { blockTopY, blockCenterY, blockHeight, objectiveY }
}

/**
 * Creates a Node for a task.
 */
function createTaskNode(taskId: string, task: Task, x: number, y: number): LayoutNode {
  return {
    id: taskId,
    type: LayoutNodeType.Task,
    position: { x, y },
    data: { 
      title: task.title 
    },
  }
}

/**
 * Creates a Node for an objective.
 */
function createObjectiveNode(objectiveId: string, objective: Objective, y: number): LayoutNode {
  return {
    id: objectiveId,
    type: LayoutNodeType.Objective,
    position: { x: 0, y },
    data: {
      title: objective.title,
      description: objective.description,
      total_tasks: objective.tasks.length,
    },
  }
}

/**
 * Creates an Edge between two nodes.
 */
function createEdge(source: string, target: string, sourceHandle?: string, targetHandle?: string): LayoutEdge {
  return { id: `edge-${source}-${target}`, source, target, sourceHandle, targetHandle }
}

/**
 * Generates task nodes and edges for one side (left or right).
 */
function generateSideTasks(
  tasks: Task[],
  objectiveId: string,
  startX: number,
  startY: number,
  sourceHandle: 'left' | 'right',
  targetHandle: 'left' | 'right'
): { nodes: LayoutNode[]; edges: LayoutEdge[] } {

  const sideNodes: LayoutNode[] = []
  const sideEdges: LayoutEdge[] = []

  let currentY = startY

  for (const task of tasks) {
    const taskId = task.task_id
    const taskHeight = estimateTaskHeight(task)

    const newTaskNode = createTaskNode(taskId, task, startX, currentY)
    sideNodes.push(newTaskNode)

    const newSideEdge = createEdge(objectiveId, taskId, sourceHandle, targetHandle)
    sideEdges.push(newSideEdge)

    currentY += taskHeight + SPACING_BETWEEN_TASKS
  }

  return { nodes: sideNodes, edges: sideEdges }
}

/**
 * Builds the layout using the predefined roadmap.layout,
 * injecting the appropriate data from objectives and tasks.
 */
function buildFromExistingLayout(roadmap: Roadmap): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  const objectiveMap = new Map<string, Objective>()
  const taskMap = new Map<string, Task>()

  for (const objective of roadmap.objectives) {
    objectiveMap.set(objective.objective_id, objective)
    for (const task of objective.tasks) {
      taskMap.set(task.task_id, task)
    }
  }

  const filledNodes: LayoutNode[] = roadmap.layout.nodes.map((node) => {
    if (node.type === LayoutNodeType.Objective) {
      const objective = objectiveMap.get(node.id)
      if (!objective) throw new Error(`Objective not found for node id ${node.id}`)

      return {
        ...node,
        data: {
          title: objective.title,
          description: objective.description,
          total_tasks: objective.tasks.length,
        }
      }
    }

    if (node.type === LayoutNodeType.Task) {
      const task = taskMap.get(node.id)
      if (!task) throw new Error(`Task not found for node id ${node.id}`)

      return {
        ...node,
        data: {
          title: task.title,
        }
      }
    }

    return node
  })

  return {
    nodes: filledNodes,
    edges: roadmap.layout.edges
  }
}

/**
 * Dynamically builds the layout from objectives and tasks.
 * Positions everything based on estimated sizes and spacing rules.
 */
function buildDynamicLayout(roadmap: Roadmap): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  const nodes: LayoutNode[] = []
  const edges: LayoutEdge[] = []

  const objectives = sortObjectives(roadmap.objectives)

  let previousBottomY = 0

  for (let i = 0; i < objectives.length; i++) {
    const objective = objectives[i]
    const objectiveId = objective.objective_id

    const { leftTasks, rightTasks } = splitTasks(objective.tasks)

    const { blockTopY, blockHeight, objectiveY } = calculateObjectiveVerticalLayout(previousBottomY, objective, leftTasks, rightTasks)

    // Add objective node
    const newObjective = createObjectiveNode(objectiveId, objective, objectiveY)
    nodes.push(newObjective)

    // Add left side tasks
    const { nodes: leftNodes, edges: leftEdges } = generateSideTasks(
      leftTasks,
      objectiveId,
      -HORIZONTAL_SPACING,
      blockTopY,
      'left',
      'right'
    )

    nodes.push(...leftNodes)
    edges.push(...leftEdges)

    // Add right side tasks
    const { nodes: rightNodes, edges: rightEdges } = generateSideTasks(
      rightTasks,
      objectiveId,
      HORIZONTAL_SPACING,
      blockTopY,
      'right',
      'left'
    )

    nodes.push(...rightNodes)
    edges.push(...rightEdges)

    // Connect objectives
    if (i > 0) {
      const previousObjectiveId = objectives[i - 1].objective_id

      const newEdge = createEdge(previousObjectiveId, objectiveId, 'bottom', 'top')
      edges.push(newEdge)
    }

    previousBottomY = blockTopY + blockHeight
  }

  return { nodes, edges }
}



// --------------------------
// Main builder
// --------------------------

/**
 * Builds the nodes and edges for the roadmap layout.
 */
export function buildRoadmapLayout(roadmap: Roadmap): { nodes: LayoutNode[]; edges: LayoutEdge[] } {
  if (roadmap.layout?.nodes?.length && roadmap.layout?.edges?.length) {
    return buildFromExistingLayout(roadmap)
  }

  return buildDynamicLayout(roadmap)
}


