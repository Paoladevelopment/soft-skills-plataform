import { Objective, Roadmap, Task } from '../../types/roadmap/roadmap.models'

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


