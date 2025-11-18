import { Resource, CreateResourcePayload, UpdateResourcePayload } from './resource.api'

export interface IResourceStore {
  resources: Resource[]
  isLoading: boolean
  error: string | null

  setResources: (resources: Resource[]) => void
  addResource: (resource: Resource) => void
  updateResource: (resourceId: string, resource: Resource) => void
  removeResource: (resourceId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void

  fetchTaskResources: (taskId: string) => Promise<void>
  createResource: (taskId: string, payload: CreateResourcePayload) => Promise<void>
  updateResourceById: (taskId: string, resourceId: string, payload: UpdateResourcePayload) => Promise<void>
  deleteResourceById: (taskId: string, resourceId: string) => Promise<void>
}

