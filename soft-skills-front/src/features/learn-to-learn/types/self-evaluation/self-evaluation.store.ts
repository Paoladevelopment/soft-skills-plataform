import type { SelfEvaluationCreate, SelfEvaluationCreated } from './self-evaluation.api'

export type SelfEvaluationStore = {
  isOpen: boolean
  submitting: boolean
  initialTaskId: string | null
  open: (taskId: string) => void
  close: () => void
  submit: (payload: SelfEvaluationCreate) => Promise<SelfEvaluationCreated>
}

