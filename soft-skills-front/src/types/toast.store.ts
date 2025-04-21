import { ToastType } from "./toast.types"

export interface IToastState {
  message: string
  type: ToastType
  open: boolean
  showToast: (message: string, type?: ToastType) => void
  hideToast: () => void
}