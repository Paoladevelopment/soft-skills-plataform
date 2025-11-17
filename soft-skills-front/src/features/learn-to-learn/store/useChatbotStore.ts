import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { IChatbotStore } from '../types/chatbot/chatbot.store'
import { ChatMessage } from '../types/chatbot/chatbot.models'
import { chatWithAithena } from '../api/Chatbot'
import i18n from '../../../i18n/config'

const getInitialMessage = () => {
  return i18n.t('chatbot.initialMessage', { ns: 'roadmap' })
}

const isRoadmapCreationMessage = (message: string): boolean => {
  const lowerMessage = message.toLowerCase()
  const hasRoadmap = lowerMessage.includes('roadmap')
  const hasCreationKeywords = 
    lowerMessage.includes('creado') || 
    lowerMessage.includes('creando') ||
    lowerMessage.includes('completado') ||
    lowerMessage.includes('notificaremos') ||
    lowerMessage.includes('siendo creado')

  return hasRoadmap && hasCreationKeywords
}

export const useChatbotStore = create<IChatbotStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        messages: [],
        threadId: null,
        isLoading: false,
        isConversationEnded: false,

        addMessage: (message: ChatMessage) => {
          set((state) => {
            state.messages.push(message)
            
            if (message.sender === 'aithena' && isRoadmapCreationMessage(message.text)) {
              state.isConversationEnded = true
            }
          }, false, 'CHATBOT/ADD_MESSAGE')
        },

        clearMessages: () => {
          set((state) => {
            state.messages = []
            state.threadId = null
            state.isConversationEnded = false
          }, false, 'CHATBOT/CLEAR_MESSAGES')
        },

        setThreadId: (id: string) => {
          set((state) => {
            state.threadId = id
          }, false, 'CHATBOT/SET_THREAD_ID')
        },

        endConversation: () => {
          set((state) => {
            state.isConversationEnded = true
          }, false, 'CHATBOT/END_CONVERSATION')
        },

        startNewConversation: () => {
          set((state) => {
            state.isConversationEnded = false
            state.messages = [
              {
                sender: 'aithena',
                text: getInitialMessage(),
              },
            ]
            state.threadId = null
          }, false, 'CHATBOT/START_NEW_CONVERSATION')
        },

        sendMessageToChatbot: async (userInput: string) => {
          const { addMessage, threadId, setThreadId } = get()

          addMessage({ sender: 'user', text: userInput })
          set((state) => {
            state.isLoading = true
          }, false, 'CHATBOT/SEND_MESSAGE_REQUEST')

          try {
            const response = await chatWithAithena({ human_say: userInput, thread_id: threadId || undefined })
          
            if (response.threadId && threadId !== response.threadId) {
              setThreadId(response.threadId)
            }

            const aithenaMessage = { sender: 'aithena' as const, text: response.content }
            addMessage(aithenaMessage)
          } catch (err) {
            console.error('Error sending message to chatbot:', err)
          } finally {
            set((state) => {
              state.isLoading = false
            }, false, 'CHATBOT/SEND_MESSAGE_COMPLETE')
          }
        },
      })),
      {
        name: 'chatbotStore',
        partialize: (state) => ({ messages: state.messages, threadId: state.threadId })
      }
    )
  )
)  