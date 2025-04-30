import { ResourceType, TaskType } from "../common.enums"
import { LayoutNodeType, RoadmapVisibility } from "./roadmap.enums"

export interface Resource {
  type: ResourceType
  title: string
  url: string
}

export interface Task {
  taskId: string
  title: string
  orderIndex: number
  type: TaskType
  resources?: Resource[]
  comments?: string[]
}

export interface Objective {
  objectiveId: string
  title: string
  description?: string
  orderIndex: number
  tasks: Task[]
  comments?: string[]
}

export type NodeData = Record<string, unknown>

export interface LayoutNode<T = NodeData> {
  id: string,
  type: LayoutNodeType
  position: {
    x: number,
    y: number,
  }
  data: T
}

export interface LayoutEdge {
  id: string,
  source: string
  sourceHandle?: string
  target: string
  targetHandle?: string
}

export interface Layout {
  nodes: LayoutNode[]
  edges: LayoutEdge[]
}

export interface Roadmap {
  roadmapId: string
  title: string
  description?: string
  objectives: Objective[]
  layout?: Layout 
  userId: string
  visibility: RoadmapVisibility
  createdAt: string | null
  updatedAt: string | null
}

export interface RoadmapSummary {
  roadmapId: string
  title: string
  description?: string
  createdAt: string | null
  stepsCount: number
}