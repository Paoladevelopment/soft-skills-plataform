export interface ChatInput {
  human_say: string
  thread_id?: string
}

export interface ChatResponse {
  threadId: string
  content: string
}