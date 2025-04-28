import { ResourceType, TaskType } from "../common.enums"
import { LayoutNodeType, RoadmapVisibility } from "./roadmap.enums"

export interface Resource {
  type: ResourceType
  title: string
  url: string
}

export interface Task {
  task_id: string
  title: string
  order_index: number
  type: TaskType
  resources?: Resource[]
  comments?: string[]
}

export interface Objective {
  objective_id: string
  title: string
  description?: string
  order_index: number
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
  roadmap_id: string
  title: string
  description?: string
  objectives: Objective[]
  layout: Layout
  user_id: string
  visibility: RoadmapVisibility
  created_at?: string
}