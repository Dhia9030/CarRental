"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { ChatMessage } from "@/types/api-types"

interface WebSocketContextType {
  connected: boolean
  messages: ChatMessage[]
  sendMessage: (message: string) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

/**
 * WebSocket endpoint for real-time chat
 * This should be set in your environment variables:
 * NEXT_PUBLIC_WS_URL=wss://your-api-url.com/ws/chat
 */
const WS_ENDPOINT = process.env.NEXT_PUBLIC_WS_URL || "wss://your-api-url.com/ws/chat"

/**
 * WebSocketProvider Component
 *
 * This provider handles real-time chat using WebSockets.
 * It maintains the connection state, message history, and provides a method for sending messages.
 *
 * @param {ReactNode} children - Child components
 */
export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  /**
   * Initialize WebSocket connection
   *
   * The WebSocket server should handle messages in the following format:
   * {
   *   id: "string",
   *   sender: "admin" | "agency",
   *   content: "string",
   *   timestamp: "ISO date string"
   * }
   */
  useEffect(() => {
    // You may need to add authentication to your WebSocket connection
    // const token = localStorage.getItem('authToken')
    // const wsUrl = `${WS_ENDPOINT}?token=${token}`

    const ws = new WebSocket(WS_ENDPOINT)

    ws.onopen = () => {
      console.log("WebSocket connected")
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as ChatMessage
        setMessages((prev) => [...prev, message])
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    ws.onclose = () => {
      console.log("WebSocket disconnected")
      setConnected(false)

      // Attempt to reconnect after a delay
      setTimeout(() => {
        setSocket(new WebSocket(WS_ENDPOINT))
      }, 5000)
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      ws.close()
    }

    setSocket(ws)

    // Clean up on unmount
    return () => {
      ws.close()
    }
  }, [])

  /**
   * Send a message through the WebSocket
   *
   * @param {string} message - Message content to send
   */
  const sendMessage = useCallback(
    (message: string) => {
      if (socket && connected) {
        // Create a message object
        const chatMessage: ChatMessage = {
          id: Date.now().toString(), // Client-generated ID, server may replace this
          sender: "agency", // Assuming the agency is the sender
          content: message,
          timestamp: new Date().toISOString(),
        }

        // Send the message as JSON
        socket.send(JSON.stringify(chatMessage))

        // Optimistically add the message to the UI
        // The server should echo back the message with a proper ID
        setMessages((prev) => [...prev, chatMessage])
      } else {
        console.error("Cannot send message: WebSocket not connected")
      }
    },
    [socket, connected],
  )

  const value = {
    connected,
    messages,
    sendMessage,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}

/**
 * Custom hook to use the WebSocket context
 *
 * @returns {WebSocketContextType} - WebSocket context value
 * @throws {Error} - If used outside of WebSocketProvider
 */
export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
