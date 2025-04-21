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

      showToast: (message: string, type: ToastType = 'success') => {
        set(
          { message, type, open: true }
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
