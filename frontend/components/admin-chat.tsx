"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWebSocket } from "@/providers/websocket-provider"

interface AdminChatProps {
  onClose: () => void
}

/**
 * AdminChat Component
 *
 * This component provides a chat interface for communication between the agency and admin.
 * It uses WebSockets for real-time messaging.
 *
 * @param {Function} onClose - Function to call when the chat is closed
 */
export function AdminChat({ onClose }: AdminChatProps) {
  const { connected, messages, sendMessage } = useWebSocket()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /**
   * Scroll to bottom when messages change
   * This ensures that the most recent messages are always visible
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /**
   * Handle sending a new message
   *
   * @param {React.FormEvent} e - Form submit event
   */
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && connected) {
      sendMessage(newMessage)
      setNewMessage("")
    }
  }

  /**
   * Format a timestamp to a readable time
   *
   * @param {string} timestamp - ISO date string
   * @returns {string} - Formatted time string (HH:MM)
   */
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 flex flex-col h-96">
      {/* Chat header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-sky-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`}></div>
          <h2 className="font-semibold">Admin Support</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-sky-700">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "agency" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-2 ${
                  message.sender === "agency" ? "bg-sky-100 text-sky-900" : "bg-slate-100 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender !== "agency" && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Admin" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                  )}
                  <span className="text-xs font-medium">{message.sender === "agency" ? "You" : "Admin"}</span>
                </div>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-right mt-1 opacity-70">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-sm text-slate-500">No messages yet</p>
            <p className="text-xs text-slate-400">Start a conversation with the admin</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!connected}
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!connected || !newMessage.trim()}
          className="bg-sky-600 hover:bg-sky-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {/* Connection status indicator */}
      {!connected && (
        <div className="px-3 py-1 bg-red-50 text-red-800 text-xs border-t border-red-100">
          Disconnected from server. Attempting to reconnect...
        </div>
      )}
    </div>
  )
}
