export const RESOURCE_TYPES = ['web', 'video', 'document', 'book', 'article', 'other'] as const
export type ResourceType = typeof RESOURCE_TYPES[number]

export interface Resource {
  resourceId: string
  taskId: string
  type: ResourceType
  title: string
  link: string
  createdAt: string
  updatedAt: string
}

export type EditingResources = Record<string, Partial<Resource>>

export interface CreateResourcePayload {
  type: ResourceType
  title: string
  link: string
}

export interface UpdateResourcePayload {
  type?: ResourceType
  title?: string
  link?: string
}

export interface ResourceResponse {
  message: string
  data: Resource
}

export interface ResourcesResponse {
  message: string
  data: Resource[]
}

export interface DeleteResourceResponse {
  message: string
  resourceId: string
}

