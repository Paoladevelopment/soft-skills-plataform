import { ResourceType, TaskType } from "../common.enums"
import { LayoutNodeType, RoadmapVisibility } from "./roadmap.enums"
import { FontSizeOption } from "./roadmap.options"

export interface Resource {
  type: ResourceType
  title: string
  url: string
}

export interface Task {
  taskId: string
  title: string
  description?: string
  contentTitle?: string
  orderIndex: number
  type?: TaskType
  comments?: string[]
  resources?: Resource[]
}

export interface Objective {
  objectiveId: string
  title: string
  description?: string
  contentTitle?: string
  orderIndex: number
  tasks: Task[]
  comments?: string[]
  resources?: Resource[]
}

export interface ObjectiveNodeData {
  title: string
  description?: string
  totalTasks?: number
  isEditable?: boolean
  fontSize?: FontSizeOption
  backgroundColor?: string
  width?: number
  height?: number
}

export interface TaskNodeData {
  title: string
  isEditable?: boolean
  fontSize?: FontSizeOption
  backgroundColor?: string
  width?: number
  height?: number
}

export interface LayoutNode<T = ObjectiveNodeData | TaskNodeData> {
  id: string,
  type: LayoutNodeType
  position: {
    x: number,
    y: number,
  }
  data: T
  width: number
  height: number
  selected: boolean
  dragging: boolean
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
  username: string
  visibility: RoadmapVisibility
  createdAt: string | null
  updatedAt: string | null
}

export interface RoadmapSummary {
  roadmapId: string
  title: string
  username: string
  description?: string
  createdAt: string | null
  stepsCount: number
  visibility: RoadmapVisibility
}

export type OnlyContentFields = Pick<Objective, 'contentTitle' | 'description' | 'resources'>
export type OptionalContentFields = Partial<OnlyContentFields>
export type OnlyRoadmapMetadata = Pick<Roadmap, 'title' | 'description' | 'visibility'>