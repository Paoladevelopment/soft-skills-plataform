import { Objective, Roadmap, Task } from '../../types/roadmap/roadmap.models'
import i18n from '../../../../i18n/config'

export const ORPHAN_OBJECTIVE_ID = '__unassigned__'
export const ORPHAN_OBJECTIVE_TITLE = () => i18n.t('editor.node.unassigned', { ns: 'roadmap' })
export const ORPHAN_OBJECTIVE_ORDER_INDEX = -1

/**
 * Updates the `orderIndex` of each objective in-place to reflect its position in the array.
 *
 * @param objectives - The list of objectives to reindex.
 */
export function reindexObjectives(objectives: Objective[]): void {
  objectives.forEach((objective, index) => {
    objective.orderIndex = index + 1
  })
}

/**
 * Updates the `orderIndex` of each task in-place to reflect its position in the array.
 *
 * @param tasks - The list of tasks to reindex.
 */
export function reindexTasks(tasks: Task[]): void {
  tasks.forEach((task, index) => {
    task.orderIndex = index + 1
  })
}

/**
 * Finds an objective in a roadmap by its objectiveId.
 *
 * @param roadmap - The roadmap containing objectives.
 * @param objectiveId - The ID of the objective to find.
 * @returns The matching Objective, or undefined if not found.
 */
export function findObjectiveById(roadmap: Roadmap, objectiveId: string): Objective | undefined {
  return roadmap.objectives.find(obj => obj.objectiveId === objectiveId)
}

/**
 * Finds a task in the roadmap by taskId, regardless of which objective it belongs to.
 *
 * @param roadmap - The roadmap containing the objectives and their tasks.
 * @param taskId - The ID of the task to find.
 * @returns The matching Task, or undefined if not found.
 */
export function findTaskById(roadmap: Roadmap, taskId: string): Task | undefined {
  for (const objective of roadmap.objectives) {
    const task = objective.tasks.find(t => t.taskId === taskId)

    if (task) return task
  }

  return undefined
}

/**
 * Finds a task by its ID within a specific objective.
 *
 * @param objective - The objective containing the task.
 * @param taskId - The ID of the task to find.
 * @returns The matching task, or undefined if not found.
 */
export function findTaskInObjective(objective: Objective, taskId: string): Task | undefined {
  return objective.tasks.find(t => t.taskId === taskId)
}

/**
 * Finds the parent objective that contains a task with the given ID.
 *
 * @param roadmap - The roadmap containing all objectives and their tasks.
 * @param taskId - The ID of the task to locate.
 * @returns The objective that contains the task, or undefined if not found.
 */
export function findParentObjectiveOfTask(roadmap: Roadmap, taskId: string): Objective | undefined {
  return roadmap.objectives.find(o => o.tasks.some(t => t.taskId === taskId))
}

/**
 * Removes an objective from a roadmap by its objectiveId and returns a new array of objectives.
 *
 * @param objectives - The array of current objectives.
 * @param objectiveId - The ID of the objective to remove.
 * @returns A new array excluding the specified objective.
 */
export function removeObjectiveById(objectives: Objective[], objectiveId: string): Objective[] {
  return objectives.filter(obj => obj.objectiveId !== objectiveId)
}

/**
 * Inserts (or moves) an objective either before or after a target, depending on whether the target is the first objective.
 *
 * @param objectives - The current list of objectives.
 * @param objectiveToInsert - The new or existing objective to place.
 * @param targetObjectiveId - The ID of the target objective to position relative to.
 */
export function insertObjectiveRelativeToTarget(
  objectives: Objective[],
  objectiveToInsert: Objective,
  targetObjectiveId: string
): void {
  const isTargetFirst = isFirstObjective(objectives, targetObjectiveId)

  if (isTargetFirst) {
    moveObjectiveBefore(objectives, objectiveToInsert, targetObjectiveId)
  } else {
    moveObjectiveAfter(objectives, objectiveToInsert, targetObjectiveId)
  }
}

/**
 * Returns true if the given objectiveId is the first in the objectives list.
 *
 * @param objectives - List of objectives to search in.
 * @param objectiveId - The ID to check.
 * @returns True if the objective is first, false otherwise.
 */
function isFirstObjective(objectives: Objective[], objectiveId: string): boolean {
  return findObjectiveIndexById(objectives, objectiveId) === 0
}

/**
 * Moves an existing objective after another one or inserts it if not present, and reindexes all objectives.
 *
 * @param objectives - The list of current objectives.
 * @param objectiveToMove - The objective to move or insert.
 * @param afterObjectiveId - The ID of the objective after which to insert the new one.
 */
function moveObjectiveAfter(objectives: Objective[], objectiveToMove: Objective, afterObjectiveId: string): void {
  removeIfExists(objectives, objectiveToMove.objectiveId)
  insertAfterObjectiveId(objectives, objectiveToMove, afterObjectiveId)
  reindexObjectives(objectives)
}

/**
 * Moves an existing objective before another one or inserts it if not present, and reindexes all objectives.
 *
 * @param objectives - The list of current objectives.
 * @param objectiveToMove - The objective to move or insert.
 * @param beforeObjectiveId - The ID of the objective before which to insert the new one.
 */
function moveObjectiveBefore(objectives: Objective[], objectiveToMove: Objective, beforeObjectiveId: string): void {
  removeIfExists(objectives, objectiveToMove.objectiveId)
  insertBeforeObjectiveId(objectives, objectiveToMove, beforeObjectiveId)
  reindexObjectives(objectives)
}

/**
 * Removes an objective from the list by ID, if it exists.
 */
function removeIfExists(objectives: Objective[], objectiveId: string): void {
  const index =  findObjectiveIndexById(objectives, objectiveId)
  removeObjectiveAtIndex(objectives, index)
}

/**
 * Inserts an objective after another one by ID. If the target is not found, it appends to the end.
 */
function insertAfterObjectiveId(objectives: Objective[], newObjective: Objective, afterObjectiveId: string): void {
  const index = findObjectiveIndexById(objectives, afterObjectiveId)
  if (index !== -1) {
    insertObjectiveAtIndex(objectives, newObjective, index + 1)
  } else {
    objectives.push(newObjective)
  }
}

/**
 * Inserts an objective before another one by ID. If the target is not found, it prepends to the beginning.
 */
function insertBeforeObjectiveId(objectives: Objective[], newObjective: Objective, beforeObjectiveId: string): void {
  const index = findObjectiveIndexById(objectives, beforeObjectiveId)
  if (index !== -1) {
    insertObjectiveAtIndex(objectives, newObjective, index)
  } else {
    objectives.unshift(newObjective)
  }
}

function findObjectiveIndexById(objectives: Objective[], objectiveId: string): number {
  return objectives.findIndex(obj => obj.objectiveId === objectiveId)
}

function removeObjectiveAtIndex(objectives: Objective[], index: number): void {
  if (index >= 0 && index < objectives.length) {
    objectives.splice(index, 1)
  }
}

function insertObjectiveAtIndex(objectives: Objective[], objective: Objective, index: number): void {
  objectives.splice(index, 0, objective)
}

/**
 * Adds a task to an objective if it does not already exist, then reindexes the tasks.
 *
 * @param objective - The objective to which the task will be added.
 * @param newTask - The task to add to the objective.
 */
export function addTaskToObjective(objective: Objective, newTask: Task): void {
  const exists = objective.tasks.some(task => task.taskId === newTask.taskId)

  if (!exists) {
    objective.tasks.push(newTask)
    reindexTasks(objective.tasks)
  }
}


/**
 * Removes a task from the given objective by taskId and reindexes the remaining tasks.
 *
 * @param objective - The objective from which the task should be removed.
 * @param taskId - The ID of the task to remove.
 */
export function removeTaskFromObjective(objective: Objective, taskId: string): void {
  objective.tasks = objective.tasks.filter(task => task.taskId !== taskId)
  reindexTasks(objective.tasks)
}


/**
 * Calculates the total number of tasks across all objectives.
 *
 * @param objectives - An array of objectives containing tasks.
 * @returns The total count of all tasks from all objectives.
 */
export function countAllTasks(objectives: Objective[]): number {
  return objectives.reduce((acc, obj) => acc + obj.tasks.length, 0)
}

/**
 * Updates the title of an objective in the roadmap if it matches the given ID.
 *
 * @param roadmap - The roadmap containing the objective.
 * @param objectiveId - The ID of the objective to update.
 * @param newTitle - The new title to set.
 */
export function updateObjectiveTitle(roadmap: Roadmap, objectiveId: string, newTitle: string): void {
  const objective = findObjectiveById(roadmap, objectiveId)
  if (objective) {
    objective.title = newTitle
  }
}

/**
 * Updates the title of a task in the roadmap if it matches the given ID.
 *
 * @param roadmap - The roadmap containing the objectives and tasks.
 * @param taskId - The ID of the task to update.
 * @param newTitle - The new title to set.
 */
export function updateTaskTitle(roadmap: Roadmap, taskId: string, newTitle: string): void {
  const task = findTaskById(roadmap, taskId)
  if (task) {
    task.title = newTitle
  }
}

/**
 * Gets the orphan/unassigned objective used to temporarily hold disconnected tasks.
 * Creates and appends it to the roadmap if it doesn't exist yet.
 *
 * @param roadmap - The roadmap to search and mutate.
 * @returns The orphan Objective.
 */
export function getOrCreateOrphanObjective(roadmap: Roadmap): Objective {
  let orphan = findObjectiveById(roadmap, ORPHAN_OBJECTIVE_ID)

  if (!orphan) {
    orphan = {
      objectiveId: ORPHAN_OBJECTIVE_ID,
      title: ORPHAN_OBJECTIVE_TITLE(),
      orderIndex: ORPHAN_OBJECTIVE_ORDER_INDEX,
      tasks: [],
    }

    roadmap.objectives.push(orphan)
  }

  return orphan
}

/**
 * Removes a task from the orphan (unassigned) objective if it exists.
 *
 * @param roadmap - The roadmap containing the objectives.
 * @param taskId - The ID of the task to remove.
 */
export function removeTaskFromOrphanObjective(roadmap: Roadmap, taskId: string): void {
  const orphan = findObjectiveById(roadmap, ORPHAN_OBJECTIVE_ID)
  if (!orphan) return

  orphan.tasks = orphan.tasks.filter(task => task.taskId !== taskId)
}

