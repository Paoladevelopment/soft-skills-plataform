import { ChatMessage } from './chatbot.models'

export interface IChatbotStore {
  messages: ChatMessage[]
  threadId: string | null
  isLoading: boolean
  isConversationEnded: boolean

  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
  setThreadId: (id: string) => void
  endConversation: () => void
  startNewConversation: () => void

  sendMessageToChatbot: (userInput: string) => Promise<void>
}
