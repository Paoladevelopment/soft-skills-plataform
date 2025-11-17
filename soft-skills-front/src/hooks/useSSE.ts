import { useEffect, useRef } from 'react'
import useAuthStore from '../features/authentication/store/useAuthStore'
import { useToastStore } from '../store/useToastStore'
import { AbortControllerRef, TimeoutRef } from '../types/sse.types'
import { environment } from '../config/env'

const RECONNECT_DELAY = 3000

const cleanupConnections = (
  abortController: AbortControllerRef,
  reconnectTimeout: TimeoutRef
) => {
  if (abortController.current) {
    abortController.current.abort()
    abortController.current = null
  }

  if (reconnectTimeout.current) {
    clearTimeout(reconnectTimeout.current)
    reconnectTimeout.current = null
  }
}

const scheduleReconnect = (
  reconnectTimeout: TimeoutRef,
  connectSSE: () => void
) => {
  reconnectTimeout.current = setTimeout(() => {
    const token = useAuthStore.getState().accessToken

    if (token) {
      connectSSE()
    }

  }, RECONNECT_DELAY)
}

const processSSEMessage = (line: string) => {
  const trimmedLine = line.trim()
  
  if (!trimmedLine || trimmedLine.startsWith(':')) {
    return
  }

  const showToast = useToastStore.getState().showToast

  let message = trimmedLine
  if (trimmedLine.startsWith('data: ')) {
    message = trimmedLine.slice(6).trim()
  }

  if (!message) {
    return
  }

  showToast(message, 'info', 5000)
}

const readSSEStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  reconnectTimeout: TimeoutRef,
  connectSSE: () => void
) => {
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        scheduleReconnect(reconnectTimeout, connectSSE)
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        processSSEMessage(line)
      }
    }
  } catch (error) {
    if (!(error instanceof Error) || error.name === 'AbortError') {
      return
    }

    console.error('Error reading SSE stream:', error)
    scheduleReconnect(reconnectTimeout, connectSSE)
  }
}

export const useSSE = () => {
  const abortControllerRef = useRef<AbortController | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (!accessToken) {
      cleanupConnections(abortControllerRef, reconnectTimeoutRef)
      return
    }

    const connectSSE = async () => {
      cleanupConnections(abortControllerRef, reconnectTimeoutRef)

      const currentToken = useAuthStore.getState().accessToken
      if (!currentToken) {
        return
      }

      try {
        const abortController = new AbortController()
        abortControllerRef.current = abortController

        const response = await fetch(`${environment.CHATBOT_BASE_URL}/events`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Accept': 'text/event-stream',
          },
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`SSE connection failed: ${response.status}`)
        }

        if (!response.body) {
          throw new Error('Response body is null')
        }

        const reader = response.body.getReader()
        readSSEStream(reader, reconnectTimeoutRef, connectSSE)
      } catch (error) {
        if (!(error instanceof Error) || error.name === 'AbortError') {
          return
        }

        console.error('Error creating SSE connection:', error)
        scheduleReconnect(reconnectTimeoutRef, connectSSE)
      }
    }

    connectSSE()

    return () => {
      cleanupConnections(abortControllerRef, reconnectTimeoutRef)
    }
  }, [accessToken])
}

