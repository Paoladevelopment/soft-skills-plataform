import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IRoadmapStore } from '../types/roadmap/roadmap.store'
import { useToastStore } from '../../../store/useToastStore'
import { LayoutNode, OnlyRoadmapMetadata, Roadmap, RoadmapSummary } from '../types/roadmap/roadmap.models'
import { createRoadmap, deleteRoadmap, getRoadmapById, getUserRoadmaps, updateRoadmap, copyRoadmap } from '../api/Roadmaps'
import { buildRoadmapLayout } from '../utils/roadmap/roadmapLayoutGenerator'
import { addTaskToObjective, countAllTasks, findObjectiveById, findTaskById, findTaskInObjective, getOrCreateOrphanObjective, insertObjectiveRelativeToTarget, reindexObjectives, removeObjectiveById, removeTaskFromObjective, removeTaskFromOrphanObjective, updateObjectiveTitle, updateTaskTitle } from '../utils/roadmap/roadmapStructureUtils'
import { createObjectiveFromNode, createTaskFromNode, findEdgeByNodeId, findNodeById, findNodeIndexById, getNodeTitle, removeEdgesByIds, removeEdgesConnectedToNode, removeNodeById, removeNodesByIds, updateObjectiveTaskCount } from '../utils/roadmap/roadmapGraphHelpers'
import { isObjectiveNode, isObjectiveToObjectiveConnection, isObjectiveToTaskConnection, isTaskNode } from '../utils/roadmap/roadmapNodeTypeUtils'
import { validateRoadmapForPublicSave } from '../utils/roadmap/roadmapValidationUtils'
import i18n from '../../../i18n/config'

export const useRoadmapStore = create<IRoadmapStore>()(
  devtools(
    immer((set, get) => ({
      editorNodes: [],
      editorEdges: [],

      myRoadmaps: [],
      isLoading: false,

      myRoadmapsPagination: {
        total: 0,
        offset: 0,
        limit: 10,
      },

      selectedRoadmap: null,
      selectedRoadmapSteps: 0,

      selectedNodeId: null,

      setMyRoadmaps: (roadmaps: RoadmapSummary[]) => {
        set((state) => {
          state.myRoadmaps = roadmaps
        }, false, 'ROADMAP/SET_MY_ROADMAPS')
      },


      setMyRoadmapsOffset: (offset: number) => {
        set((state) => {
          state.myRoadmapsPagination.offset = offset
        }, false, 'ROADMAP/SET_MY_OFFSET')
      },


      setMyRoadmapsLimit: (limit: number) => {
        set((state) => {
          state.myRoadmapsPagination.limit = limit
        }, false, 'ROADMAP/SET_MY_LIMIT')
      },


      setMyRoadmapsTotal: (total: number) => {
        set((state) => {
          state.myRoadmapsPagination.total = total
        }, false, 'ROADMAP/SET_MY_TOTAL')
      },


      setSelectedRoadmap: (roadmap: Roadmap | null) => {
        set((state) => {
          state.selectedRoadmap = roadmap
        }, false, 'ROADMAP/SET_SELECTED_ROADMAP')
      },

      setSelectedRoadmapMetadata: (metadata: OnlyRoadmapMetadata) => {
        set((state) => {
          if (!state.selectedRoadmap) return

          state.selectedRoadmap = {
            ...state.selectedRoadmap,
            ...metadata,
          }
        })
      },

      setSelectedNodeId: (id: string | null) => {
        set((state) => {
          state.selectedNodeId = id
        }, false, 'EDITOR/SET_SELECTED_NODE_ID')
      },

      setSelectedRoadmapSteps: (stepsCount: number) => {
        set((state) => {
          state.selectedRoadmapSteps = stepsCount
        }, false, 'ROADMAP/SET_SELECTED_ROADMAP_STEPS')
      },

      setEditorNodes: (nodes) => {
        set((state) => {
          state.editorNodes = nodes
          if (state.selectedRoadmap?.layout) {
            state.selectedRoadmap.layout.nodes = nodes
          }
        }, false, 'EDITOR/SET_NODES')
      },
      
      setEditorEdges: (edges) => {
        set((state) => {
          state.editorEdges = edges
          if (state.selectedRoadmap?.layout) {
            state.selectedRoadmap.layout.edges = edges
          }
        }, false, 'EDITOR/SET_EDGES')
      },
      
      addEditorNode: (node) => {
        set((state) => {
          state.editorNodes.push(node)

          if (!state.selectedRoadmap) return

          if (isObjectiveNode(node)) {
            //TO DO: verify existence of the new inserted objective in case it is implemented the undo functionality
            const newObjective = createObjectiveFromNode(node)
            state.selectedRoadmap.objectives.push(newObjective)
          }

          if (isTaskNode(node)) {
            const orphan = getOrCreateOrphanObjective(state.selectedRoadmap)
            // TODO: If undo/redo is implemented, ensure task is not already present in orphan.tasks

            const newTask = createTaskFromNode(node)
            orphan.tasks.push(newTask)
          }

          if (state.selectedRoadmap.layout) {
            state.selectedRoadmap.layout.nodes = state.editorNodes
          }
        }, false, 'EDITOR/ADD_NODE')
      },
      
      updateEditorNode: (updatedNode) => {
        set((state) => {
          const index = findNodeIndexById(state.editorNodes, updatedNode.id)
          if (index !== -1) {
            state.editorNodes[index] = updatedNode
          }

          if (!state.selectedRoadmap) return

          const newTitle = getNodeTitle(updatedNode)
          if (!newTitle) return

          if(isObjectiveNode(updatedNode)) {
            updateObjectiveTitle(state.selectedRoadmap, updatedNode.id, newTitle)
          }

          if(isTaskNode(updatedNode)) {
            updateTaskTitle(state.selectedRoadmap, updatedNode.id, newTitle) 
          }

        }, false, 'EDITOR/UPDATE_NODE_AND_SYNC_TITLE')
      },
      
      removeEditorNode: (id) => {
        set((state) => {
          state.editorNodes = state.editorNodes.filter(n => n.id !== id)
        }, false, 'EDITOR/REMOVE_NODE')
      },
      
      addEditorEdge: (edge) => {
        set((state) => {
          state.editorEdges.push(edge)
        }, false, 'EDITOR/ADD_EDGE')
      },
      
      removeEditorEdge: (id) => {
        set((state) => {
          state.editorEdges = state.editorEdges.filter(e => e.id !== id)
        }, false, 'EDITOR/REMOVE_EDGE')
      },

      removeTaskNode: (taskId: string) => {
        set((state) => {
          if (!state.selectedRoadmap) return

          const parentEdge = findEdgeByNodeId(state.editorEdges, taskId)
          const objectiveNodeId = parentEdge?.source

          if (objectiveNodeId) {
            const targetObjective = findObjectiveById(state.selectedRoadmap, objectiveNodeId)

            if (targetObjective) {
              removeTaskFromObjective(targetObjective, taskId)

              updateObjectiveTaskCount(state.editorNodes, objectiveNodeId, targetObjective.tasks.length)
            }
          }

          state.editorNodes = removeNodeById(state.editorNodes, taskId)
          state.editorEdges = removeEdgesConnectedToNode(state.editorEdges, taskId) 

          if (state.selectedRoadmap.layout) {
            state.selectedRoadmap.layout.nodes = state.editorNodes
            state.selectedRoadmap.layout.edges = state.editorEdges
          }

          state.selectedRoadmapSteps = countAllTasks(state.selectedRoadmap.objectives)
      
        }, false, 'EDITOR/REMOVE_TASK_NODE')
      },      

      removeObjectiveNode: (objectiveId: string) => {
        set((state) => {
          if (!state.selectedRoadmap) return

          state.editorNodes = removeNodeById(state.editorNodes, objectiveId)
          state.editorEdges = removeEdgesConnectedToNode(state.editorEdges, objectiveId)
      
          const removedObjective = findObjectiveById(state.selectedRoadmap, objectiveId)
          const taskIdsToRemove = removedObjective?.tasks.map(t => t.taskId) || []
      
          state.editorNodes = removeNodesByIds(state.editorNodes, taskIdsToRemove)
          state.editorEdges = removeEdgesByIds(state.editorEdges, taskIdsToRemove)
      
          if (state.selectedRoadmap) {
            state.selectedRoadmap.objectives = removeObjectiveById(state.selectedRoadmap.objectives, objectiveId)
            reindexObjectives(state.selectedRoadmap.objectives)
             
            if (state.selectedRoadmap.layout) {
              state.selectedRoadmap.layout.nodes = state.editorNodes
              state.selectedRoadmap.layout.edges = state.editorEdges
            }
            
            state.selectedRoadmapSteps = countAllTasks(state.selectedRoadmap.objectives)
          }
        }, false, 'EDITOR/REMOVE_OBJECTIVE_NODE')
      },      

      resetEditorLayout: () => {
        set((state) => {
          state.editorNodes = []
          state.editorEdges = []
        }, false, 'EDITOR/RESET_LAYOUT')
      },

      fetchMyRoadmaps: async (offset?: number, limit?: number) => {
        const currentOffset = offset ?? get().myRoadmapsPagination.offset
        const currentLimit = limit ?? get().myRoadmapsPagination.limit

        set((state) => {
          state.isLoading = true
        }, false, 'ROADMAP/FETCH_MY_REQUEST')

        try {
          const { data, total } = await getUserRoadmaps(currentOffset, currentLimit)

          get().setMyRoadmaps(data)
          get().setMyRoadmapsTotal(total)
        } catch (err: unknown) {
          if (err instanceof Error) {
            const message = err.message || i18n.t('toasts.fetchError', { ns: 'roadmap' })
            useToastStore.getState().showToast(message, 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROADMAP/FETCH_MY_COMPLETE')
        }
      },


      getRoadmapById: async (id: string, editable: boolean = false) => {
        set((state) => {
          state.isLoading = true
        }, false, 'ROADMAP/FETCH_BY_ID_REQUEST')
      
        try {
          const roadmap = await getRoadmapById(id)
          const layout = buildRoadmapLayout(roadmap, editable)

          const stepsCount = roadmap.objectives.reduce((acc, obj) => acc + obj.tasks.length, 0)
      
          get().setSelectedRoadmap(roadmap)
          get().setSelectedRoadmapSteps(stepsCount)
          get().setEditorNodes(layout.nodes as LayoutNode[])
          get().setEditorEdges(layout.edges)
        } catch (err: unknown) {
          if (err instanceof Error) {
            const message = err.message || i18n.t('toasts.fetchByIdError', { ns: 'roadmap' })
            useToastStore.getState().showToast(message, 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROADMAP/FETCH_BY_ID_COMPLETE')
        }
      },

      deleteRoadmap: async (id) => {
        try {
          const { message } = await deleteRoadmap(id)

          set((state) => {
            state.myRoadmaps = state.myRoadmaps.filter(r => r.roadmapId !== id)
            
            const { offset, limit, total } = state.myRoadmapsPagination
            const remainingItems = total - 1

            const isPageEmpty = offset >= remainingItems && offset !== 0
            if (isPageEmpty) {
              state.myRoadmapsPagination.offset = offset - limit
            }

            state.myRoadmapsPagination.total = remainingItems
          }, false, 'ROADMAP/DELETE_ROADMAP_SUCCESS')

          const successMessage = message || i18n.t('toasts.deleteSuccess', { ns: 'roadmap' })
          useToastStore.getState().showToast(successMessage, 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('toasts.deleteError', { ns: 'roadmap' })
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        }
      },

      createRoadmap: async (title, description) => {
        set((state) => {
          state.isLoading = true
        }, false, 'ROADMAP/CREATE_REQUEST')
      
        try {
          const newRoadmap = await createRoadmap({ title, description })
          const successMessage = i18n.t('toasts.createSuccess', { ns: 'roadmap' })
          useToastStore.getState().showToast(successMessage, 'success')
          
          get().fetchMyRoadmaps()
          return newRoadmap.roadmapId
      
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('toasts.createError', { ns: 'roadmap' })
            useToastStore.getState().showToast(errorMessage, 'error')
          }
          
          return null
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROADMAP/CREATE_COMPLETE')
        }
      },  
      
      updateRoadmap: async (id) => {
        const roadmap = get().selectedRoadmap
        const editorNodes = get().editorNodes
        const editorEdges = get().editorEdges

        if (!roadmap) return

        const isPublic = roadmap.visibility === 'public'
      
        if (isPublic) {
          const validation = validateRoadmapForPublicSave(roadmap)
          
          if (!validation.isValid) {
            useToastStore.getState().showToast(validation.errorMessage!, 'error')
            return
          }
        }

        try {
          const updatedRoadmap = {
            ...roadmap,
            layout: {
              nodes: editorNodes,
              edges: editorEdges,
            }
          }
          
          await updateRoadmap(id, updatedRoadmap)
      
          const successMessage = i18n.t('toasts.updateSuccess', { ns: 'roadmap' })
          useToastStore.getState().showToast(successMessage, 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('toasts.updateError', { ns: 'roadmap' })
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        }
      },

      updateRoadmapMetadata: async (id: string, updates: OnlyRoadmapMetadata) => {
        const roadmap = get().selectedRoadmap

        if (!roadmap) return

        try {
          const updated = {
            ...roadmap,
            ...updates,
          }

          const response = await updateRoadmap(id, updated)

          if (roadmap.roadmapId === response.roadmapId) {
             get().setSelectedRoadmapMetadata(updates)
          }

           const successMessage = i18n.t('toasts.updateMetadataSuccess', { ns: 'roadmap' })
           useToastStore.getState().showToast(successMessage, 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('toasts.updateMetadataError', { ns: 'roadmap' })
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        }
      },

      updateRoadmapAfterConnection: (connection) => {
        set((state) => {
          const { source, target } = connection
          
          if (!source || !target) return

          const sourceNode = findNodeById(state.editorNodes, source)
          const targetNode = findNodeById(state.editorNodes, target)
      
          if (!state.selectedRoadmap || !sourceNode || !targetNode) return
      
          if (isObjectiveToObjectiveConnection(sourceNode, targetNode)) {
            const sourceExists = !!findObjectiveById(state.selectedRoadmap, sourceNode.id)
            const targetExists = !!findObjectiveById(state.selectedRoadmap, targetNode.id)

            if (sourceExists && targetExists) return

            if (!sourceExists && targetExists) {
              const newObjective = createObjectiveFromNode(sourceNode)
              insertObjectiveRelativeToTarget(state.selectedRoadmap.objectives, newObjective, targetNode.id)
            }

            if (sourceExists && !targetExists) {
              const newObjective = createObjectiveFromNode(targetNode)
              insertObjectiveRelativeToTarget(state.selectedRoadmap.objectives, newObjective, sourceNode.id)
            }

            return
          }
      
          if (isObjectiveToTaskConnection(sourceNode, targetNode)) {
            const parentObjective = findObjectiveById(state.selectedRoadmap, source)
            if (parentObjective) {
              const taskId = targetNode.id

              const existingTask = findTaskById(state.selectedRoadmap, taskId)

              if (existingTask) {
                removeTaskFromOrphanObjective(state.selectedRoadmap, taskId)
                addTaskToObjective(parentObjective, existingTask)
              } else {
                const newTask = createTaskFromNode(targetNode)
                addTaskToObjective(parentObjective, newTask)
              }

              updateObjectiveTaskCount(state.editorNodes, parentObjective.objectiveId, parentObjective.tasks.length)
            }
          }
      
          state.selectedRoadmapSteps = countAllTasks(state.selectedRoadmap.objectives)
        }, false, 'ROADMAP/UPDATE_FROM_CONNECTION')
      },
      
      updateObjectiveContent: (objectiveId, updates) => {
        set((state) => {
          const objective = state.selectedRoadmap ? findObjectiveById(state.selectedRoadmap, objectiveId) : undefined
          if (!objective) return
      
          Object.assign(objective, updates)
        }, false, 'ROADMAP/UPDATE_OBJECTIVE_CONTENT')
      },

      updateTaskContent: (objectiveId, taskId, updates) => {
        set((state) => {
          const objective = state.selectedRoadmap ? findObjectiveById(state.selectedRoadmap, objectiveId) : undefined
          if (!objective) return
      
          const task = findTaskInObjective(objective, taskId) 
          if (!task) return
      
          Object.assign(task, updates)
        }, false, 'ROADMAP/UPDATE_TASK_CONTENT')
      },

      copyRoadmap: async (id: string) => {
        try {
          const response = await copyRoadmap(id)
          const successMessage = response.message || i18n.t('toasts.copySuccess', { ns: 'roadmap', defaultValue: 'Roadmap copied successfully' })
          
          useToastStore.getState().showToast(successMessage, 'success')
          
          return response.roadmapId
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('toasts.copyError', { ns: 'roadmap', defaultValue: 'Failed to copy roadmap' })
            useToastStore.getState().showToast(errorMessage, 'error')
          }
          
          return null
        }
      },
    })),

    { name: 'roadmapStore' }
  )
)