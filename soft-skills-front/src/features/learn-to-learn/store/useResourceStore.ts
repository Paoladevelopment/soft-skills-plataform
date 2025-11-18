import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { IResourceStore } from '../types/planner/resource.store'
import { Resource, CreateResourcePayload, UpdateResourcePayload } from '../types/planner/resource.api'
import { getTaskResources, createTaskResource, updateTaskResource, deleteTaskResource } from '../api/Resources'
import { useToastStore } from '../../../store/useToastStore'
import i18n from '../../../i18n/config'

const initialState = {
  resources: [] as Resource[],
  isLoading: false,
  error: null as string | null,
}

export const useResourceStore = create<IResourceStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      setResources: (resources: Resource[]) => {
        set((state) => {
          state.resources = resources
        }, false, 'RESOURCE/SET_RESOURCES')
      },

      addResource: (resource: Resource) => {
        set((state) => {
          state.resources.push(resource)
        }, false, 'RESOURCE/ADD_RESOURCE')
      },

      updateResource: (resourceId: string, resource: Resource) => {
        set((state) => {
          const index = state.resources.findIndex(r => r.resourceId === resourceId)
          if (index !== -1) {
            state.resources[index] = resource
          }
        }, false, 'RESOURCE/UPDATE_RESOURCE')
      },

      removeResource: (resourceId: string) => {
        set((state) => {
          state.resources = state.resources.filter(r => r.resourceId !== resourceId)
        }, false, 'RESOURCE/REMOVE_RESOURCE')
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading
        }, false, 'RESOURCE/SET_LOADING')
      },

      setError: (error: string | null) => {
        set((state) => {
          state.error = error
        }, false, 'RESOURCE/SET_ERROR')
      },

      clearError: () => {
        set((state) => {
          state.error = null
        }, false, 'RESOURCE/CLEAR_ERROR')
      },

      reset: () => {
        set(initialState, false, 'RESOURCE/RESET')
      },

      fetchTaskResources: async (taskId: string) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        }, false, 'RESOURCE/FETCH_REQUEST')

        try {
          const response = await getTaskResources(taskId)
          get().setResources(response.data)
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('resources.fetchError', { ns: 'tasks', defaultValue: 'Failed to fetch resources' })
            get().setError(errorMessage)

            useToastStore.getState().showToast(errorMessage, 'error')
          }
        } finally {
          set((state) => {
            state.isLoading = false
          }, false, 'RESOURCE/FETCH_COMPLETE')
        }
      },

      createResource: async (taskId: string, payload: CreateResourcePayload) => {
        set((state) => {
          state.error = null
        }, false, 'RESOURCE/CREATE_REQUEST')

        try {
          const response = await createTaskResource(taskId, payload)
          get().addResource(response.data)

          const successMessage = i18n.t('resources.createSuccess', { ns: 'tasks' })
          useToastStore.getState().showToast(successMessage, 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('resources.createError', { ns: 'tasks' })

            get().setError(errorMessage)
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        }
      },

      updateResourceById: async (taskId: string, resourceId: string, payload: UpdateResourcePayload) => {
        set((state) => {
          state.error = null
        }, false, 'RESOURCE/UPDATE_REQUEST')

        try {
          const response = await updateTaskResource(taskId, resourceId, payload)
          get().updateResource(resourceId, response.data)

          const successMessage = i18n.t('resources.updateSuccess', { ns: 'tasks' })
          useToastStore.getState().showToast(successMessage, 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('resources.updateError', { ns: 'tasks' })

            get().setError(errorMessage)
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        }
      },

      deleteResourceById: async (taskId: string, resourceId: string) => {
        set((state) => {
          state.error = null
        }, false, 'RESOURCE/DELETE_REQUEST')

        try {
          const response = await deleteTaskResource(taskId, resourceId)
          get().removeResource(resourceId)

          const successMessage = response.message || i18n.t('resources.deleteSuccess', { ns: 'tasks' })
          useToastStore.getState().showToast(successMessage, 'success')
        } catch (err: unknown) {
          if (err instanceof Error) {
            const errorMessage = err.message || i18n.t('resources.deleteError', { ns: 'tasks' })
            
            get().setError(errorMessage)
            useToastStore.getState().showToast(errorMessage, 'error')
          }
        }
      },
    })),
    { name: 'resourceStore' }
  )
)

