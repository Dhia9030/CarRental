"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Notification } from "@/types/api-types"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

/**
 * SSE endpoint for real-time notifications
 * This should be set in your environment variables:
 * NEXT_PUBLIC_SSE_URL=https://your-api-url.com/api/notifications/sse
 */
const SSE_ENDPOINT = process.env.NEXT_PUBLIC_SSE_URL || "https://your-api-url.com/api/notifications/sse"

/**
 * API base URL for notification-related API calls
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-api-url.com/api"

/**
 * NotificationProvider Component
 *
 * This provider handles real-time notifications using Server-Sent Events (SSE).
 * It maintains the state of all notifications and provides methods for marking them as read.
 *
 * @param {ReactNode} children - Child components
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length

  /**
   * Mark a notification as read
   *
   * Endpoint: POST /notifications/:id/read
   * Response: Success message
   *
   * @param {string} id - ID of the notification to mark as read
   */
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )

    // Update on the backend
    fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authentication header if needed
        // "Authorization": `Bearer ${token}`
      },
    }).catch((error) => {
      console.error("Error marking notification as read:", error)
    })
  }

  /**
   * Mark all notifications as read
   *
   * Endpoint: POST /notifications/read-all
   * Response: Success message
   */
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))

    // Update on the backend
    fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authentication header if needed
        // "Authorization": `Bearer ${token}`
      },
    }).catch((error) => {
      console.error("Error marking all notifications as read:", error)
    })
  }

  // Set up SSE connection and fetch existing notifications
  useEffect(() => {
    /**
     * Fetch existing notifications
     *
     * Endpoint: GET /notifications
     * Response: Array of Notification objects
     */
    fetch(`${API_BASE_URL}/notifications`, {
      headers: {
        // Add authentication header if needed
        // "Authorization": `Bearer ${token}`
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`)
        }
        return response.json()
      })
      .then((data: Notification[]) => {
        setNotifications(data)
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error)
      })

    /**
     * Set up SSE connection for real-time notifications
     *
     * The server should send events in the following format:
     * {
     *   id: "string",
     *   type: "BOOKING" | "REVIEW" | "SYSTEM",
     *   title: "string",
     *   message: "string",
     *   isRead: false,
     *   createdAt: "ISO date string",
     *   data: {} (optional)
     * }
     */
    const source = new EventSource(SSE_ENDPOINT)

    // Handle incoming notification events
    source.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data) as Notification
        setNotifications((prev) => [newNotification, ...prev])
      } catch (error) {
        console.error("Error parsing SSE notification:", error)
      }
    }

    // Handle SSE connection errors
    source.onerror = (error) => {
      console.error("SSE connection error:", error)
      source.close()

      // Attempt to reconnect after a delay
      setTimeout(() => {
        setEventSource(new EventSource(SSE_ENDPOINT))
      }, 5000)
    }

    setEventSource(source)

    // Clean up on unmount
    return () => {
      source.close()
    }
  }, [])

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

/**
 * Custom hook to use the notification context
 *
 * @returns {NotificationContextType} - Notification context value
 * @throws {Error} - If used outside of NotificationProvider
 */
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
