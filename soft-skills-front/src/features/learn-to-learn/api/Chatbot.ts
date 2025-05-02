import { api } from "../../../config/api"
import { fetchWithAuth } from "../../../utils/fetchWithAuth"
import { ChatInput, ChatResponse } from "../types/chatbot/chatbot.api"


export async function chatWithAithena(
  input: ChatInput
): Promise<ChatResponse> {
  const url = api.chatbot.chat(input.thread_id)

  const response = await fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify({ human_say: input.human_say }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  return response
}
