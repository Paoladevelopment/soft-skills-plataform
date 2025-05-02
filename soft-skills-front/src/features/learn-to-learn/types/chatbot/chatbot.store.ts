import { ChatMessage } from './chatbot.models'

export interface IChatbotStore {
  messages: ChatMessage[]
  threadId: string | null
  isLoading: boolean

  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
  setThreadId: (id: string) => void

  sendMessageToChatbot: (userInput: string) => Promise<void>
}
