import { Connection } from "reactflow"
import { PaginationState } from "../pagination"
import { LayoutEdge, LayoutNode, OnlyRoadmapMetadata, OptionalContentFields, Roadmap, RoadmapSummary } from "./roadmap.models"

export interface IRoadmapStore {
  editorNodes: LayoutNode[]
  editorEdges: LayoutEdge[]

  setEditorNodes: (nodes: LayoutNode[]) => void
  setEditorEdges: (edges: LayoutEdge[]) => void

  addEditorNode: (node: LayoutNode) => void
  updateEditorNode: (node: LayoutNode) => void
  removeEditorNode: (id: string) => void

  removeTaskNode: (taskId: string) => void
  removeObjectiveNode: (objectiveId: string) => void

  addEditorEdge: (edge: LayoutEdge) => void
  removeEditorEdge: (id: string) => void

  resetEditorLayout: () => void

  selectedNodeId: string | null
  setSelectedNodeId: (id: string | null) => void

  selectedRoadmap: Roadmap | null
  selectedRoadmapSteps: number

  myRoadmaps: RoadmapSummary[]

  isLoading: boolean

  myRoadmapsPagination: PaginationState

  setMyRoadmaps: (roadmaps: RoadmapSummary[]) => void

  setSelectedRoadmap: (roadmap: Roadmap | null) => void
  setSelectedRoadmapMetadata: (metadata: OnlyRoadmapMetadata) => void
  setSelectedRoadmapSteps: (stepsCount: number) => void

  setMyRoadmapsOffset: (offset: number) => void

  setMyRoadmapsLimit: (limit: number) => void

  setMyRoadmapsTotal: (total: number) => void

  fetchMyRoadmaps: (offset?: number, limit?: number) => Promise<void>

  getRoadmapById: (id: string, editable?: boolean) => Promise<void>
  deleteRoadmap: (id: string) => Promise<void>
  createRoadmap: (title: string, description: string) => Promise<string | null>
  updateRoadmap: (id: string) => Promise<void>
  updateRoadmapMetadata: (id: string, updates: OnlyRoadmapMetadata) => Promise<void>
  copyRoadmap: (id: string) => Promise<string | null>

  updateRoadmapAfterConnection: (connection: Connection) => void

  updateObjectiveContent: (objectiveId: string, updates: OptionalContentFields) => void
  updateTaskContent: (objectiveId: string, taskId: string, updates: OptionalContentFields) => void
}