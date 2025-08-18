import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { IToastState } from '../types/toast.store'
import { ToastType } from '../types/toast.types'

export const useToastStore = create<IToastState>()(
  devtools(
    (set) => ({
      message: '',
      type: 'success',
      open: false,
      timeout: 4000, // Default 4 seconds

      showToast: (message: string, type: ToastType = 'success', timeout?: number) => {
        set(
          { 
            message, 
            type, 
            open: true,
            timeout: timeout || 4000
          }
        )
      },

      hideToast: () => {
        set(
          { open: false }
        )
      }
    }), 
    { name: 'toastStore' }
  )
)
