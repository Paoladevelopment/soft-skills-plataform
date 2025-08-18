import { ToastType } from "./toast.types"

export interface IToastState {
  message: string
  type: ToastType
  open: boolean
  timeout: number
  showToast: (message: string, type?: ToastType, timeout?: number) => void
  hideToast: () => void
}