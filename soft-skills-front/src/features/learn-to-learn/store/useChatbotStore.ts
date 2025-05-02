import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { IChatbotStore } from '../types/chatbot/chatbot.store'
import { ChatMessage } from '../types/chatbot/chatbot.models'
import { chatWithAithena } from '../api/Chatbot'

export const useChatbotStore = create<IChatbotStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        messages: [
          {
            sender: 'aithena',
            text: "I can help you create a learning roadmap for various subjects like programming languages, web development, data science, and more. Send me a message to get started!",
          },
        ],
        threadId: null,
        isLoading: false,

        addMessage: (message: ChatMessage) => {
          set((state) => {
            state.messages.push(message)
          }, false, 'CHATBOT/ADD_MESSAGE')
        },

        clearMessages: () => {
          set((state) => {
            state.messages = []
            state.threadId = null
          }, false, 'CHATBOT/CLEAR_MESSAGES')
        },

        setThreadId: (id: string) => {
          set((state) => {
            state.threadId = id
          }, false, 'CHATBOT/SET_THREAD_ID')
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

            addMessage({ sender: 'aithena', text: response.content })
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