import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IRoadmapStore } from '../types/roadmap/roadmap.store'
import { useToastStore } from '../../../store/useToastStore'
import { Roadmap, RoadmapSummary } from '../types/roadmap/roadmap.models'
import { getPublicRoadmaps, getRoadmapById, getUserRoadmaps } from '../api/Roadmaps'
import { buildRoadmapLayout } from '../utils/roadmap/roadmap_layout_generator'
import { addTaskToObjective, countAllTasks, findObjectiveById, insertObjectiveRelativeToTarget, reindexObjectives, removeObjectiveById, removeTaskFromObjective } from '../utils/roadmap/roadmap_structure_utils'
import { LayoutNodeType } from '../types/roadmap/roadmap.enums'
import { createObjectiveFromNode, createTaskFromNode, findEdgeByNodeId, findNodeById, removeEdgesByIds, removeEdgesConnectedToNode, removeNodeById, removeNodesByIds, updateObjectiveTaskCount } from '../utils/roadmap/roadmap_graph_helpers'

export const useRoadmapStore = create<IRoadmapStore>()(
  devtools(
    immer((set, get) => ({
      editorNodes: [],
      editorEdges: [],

      myRoadmaps: [],
      publicRoadmaps: [],
      isLoading: false,

      myRoadmapsPagination: {
        total: 0,
        offset: 0,
        limit: 10,
      },

      publicRoadmapsPagination: {
        offset: 0,
        limit: 10,
        total: 0,
      },

      selectedRoadmap: null,
      selectedRoadmapSteps: 0,

      selectedNodeId: null,

      setMyRoadmaps: (roadmaps: RoadmapSummary[]) => {
        set((state) => {
          state.myRoadmaps = roadmaps
        }, false, 'ROADMAP/SET_MY_ROADMAPS')
      },

      setPublicRoadmaps: (roadmaps: RoadmapSummary[]) => {
        set((state) => {
          state.publicRoadmaps = roadmaps
        }, false, 'ROADMAP/SET_PUBLIC_ROADMAPS')
      },

      setMyRoadmapsOffset: (offset: number) => {
        set((state) => {
          state.myRoadmapsPagination.offset = offset
        }, false, 'ROADMAP/SET_MY_OFFSET')
      },

      setPublicRoadmapsOffset: (offset: number) => {
        set((state) => {
          state.publicRoadmapsPagination.offset = offset
        }, false, 'ROADMAP/SET_PUBLIC_OFFSET')
      },

      setMyRoadmapsLimit: (limit: number) => {
        set((state) => {
          state.myRoadmapsPagination.limit = limit
        }, false, 'ROADMAP/SET_MY_LIMIT')
      },

      setPublicRoadmapsLimit: (limit: number) => {
        set((state) => {
          state.publicRoadmapsPagination.limit = limit
        }, false, 'ROADMAP/SET_PUBLIC_LIMIT')
      },

      setMyRoadmapsTotal: (total: number) => {
        set((state) => {
          state.myRoadmapsPagination.total = total
        }, false, 'ROADMAP/SET_MY_TOTAL')
      },

      setPublicRoadmapsTotal: (total: number) => {
        set((state) => {
          state.publicRoadmapsPagination.total = total
        }, false, 'ROADMAP/SET_PUBLIC_TOTAL')
      },

      setSelectedRoadmap: (roadmap: Roadmap | null) => {
        set((state) => {
          state.selectedRoadmap = roadmap
        }, false, 'ROADMAP/SET_SELECTED_ROADMAP')
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
        }, false, 'EDITOR/ADD_NODE')
      },
      
      updateEditorNode: (updatedNode) => {
        set((state) => {
          const index = state.editorNodes.findIndex(n => n.id === updatedNode.id)
          if (index !== -1) {
            state.editorNodes[index] = updatedNode
          }
        }, false, 'EDITOR/UPDATE_NODE')
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
            useToastStore.getState().showToast(err.message || 'Error fetching your roadmaps', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROADMAP/FETCH_MY_COMPLETE')
        }
      },

      fetchPublicRoadmaps: async (offset?: number, limit?: number) => {
        const currentOffset = offset ?? get().publicRoadmapsPagination.offset
        const currentLimit = limit ?? get().publicRoadmapsPagination.limit

        set((state) => {
          state.isLoading = true
        }, false, 'ROADMAP/FETCH_PUBLIC_REQUEST')

        try {
          const { data, total } = await getPublicRoadmaps(currentOffset, currentLimit)

          get().setPublicRoadmaps(data)
          get().setPublicRoadmapsTotal(total)
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error fetching public roadmaps', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROADMAP/FETCH_PUBLIC_COMPLETE')
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
          get().setEditorNodes(layout.nodes)
          get().setEditorEdges(layout.edges)
        } catch (err: unknown) {
          if (err instanceof Error) {
            useToastStore.getState().showToast(err.message || 'Error fetching roadmap', 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'ROADMAP/FETCH_BY_ID_COMPLETE')
        }
      },

      deleteRoadmap: async (id: string) => {
        console.log(id)
      },

      updateRoadmapAfterConnection: (connection) => {
        set((state) => {
          const { source, target } = connection
          
          if (!source || !target) return

          const sourceNode = findNodeById(state.editorNodes, source)
          const targetNode = findNodeById(state.editorNodes, target)
      
          if (!state.selectedRoadmap || !sourceNode || !targetNode) return
      
          if (sourceNode.type === LayoutNodeType.Objective && targetNode.type === LayoutNodeType.Objective) {
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
      
          if (sourceNode.type === LayoutNodeType.Objective && targetNode.type === LayoutNodeType.Task) {
            const parentObjective = findObjectiveById(state.selectedRoadmap, source)
            if (parentObjective) {
              const newTask = createTaskFromNode(targetNode)
              addTaskToObjective(parentObjective, newTask)

              updateObjectiveTaskCount(state.editorNodes, parentObjective.objectiveId, parentObjective.tasks.length)
            }
          }
      
          state.selectedRoadmapSteps = countAllTasks(state.selectedRoadmap.objectives)
        }, false, 'ROADMAP/UPDATE_FROM_CONNECTION')
      },     
    })),

    { name: 'roadmapStore' }
  )
)