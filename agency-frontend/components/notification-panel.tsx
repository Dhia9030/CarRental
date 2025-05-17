"use client"

import { useState } from "react"
import { X, Bell, MessageSquare, CalendarClock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/providers/notification-provider"

interface NotificationPanelProps {
  onClose: () => void
}

/**
 * NotificationPanel Component
 *
 * This component displays a panel of notifications with filtering options.
 * It shows notification details and provides options to mark them as read.
 *
 * @param {Function} onClose - Function to call when the panel is closed
 */
export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [activeTab, setActiveTab] = useState("all")

  /**
   * Filter notifications based on the active tab
   *
   * - "all": All notifications
   * - "unread": Only unread notifications
   * - "reviews": Only review notifications
   * - "bookings": Only booking notifications
   */
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.isRead
    if (activeTab === "reviews") return notification.type === "REVIEW"
    if (activeTab === "bookings") return notification.type === "BOOKING"
    return true
  })

  /**
   * Get an icon for a notification based on its type
   *
   * @param {string} type - Notification type
   * @returns {JSX.Element} - Icon component
   */
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "REVIEW":
        return <MessageSquare className="h-5 w-5 text-amber-500" />
      case "BOOKING":
        return <CalendarClock className="h-5 w-5 text-sky-500" />
      default:
        return <Bell className="h-5 w-5 text-slate-500" />
    }
  }

  /**
   * Format a date string to a relative time (e.g., "5 minutes ago")
   *
   * @param {string} dateString - ISO date string
   * @returns {string} - Relative time string
   */
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)

    if (diffSec < 60) return `${diffSec} seconds ago`
    if (diffMin < 60) return `${diffMin} minutes ago`
    if (diffHour < 24) return `${diffHour} hours ago`
    if (diffDay === 1) return "Yesterday"
    if (diffDay < 30) return `${diffDay} days ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-lg z-50 flex flex-col">
      {/* Panel header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-sky-600" />
          <h2 className="font-semibold">Notifications</h2>
          {unreadCount > 0 && <Badge className="bg-sky-600">{unreadCount}</Badge>}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="p-2 border-b border-slate-200">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 bg-sky-50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mark all as read button */}
      {unreadCount > 0 && (
        <div className="p-2 border-b border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sky-600 hover:text-sky-700 hover:bg-sky-50"
            onClick={markAllAsRead}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      )}

      {/* Notification list */}
      <div className="flex-1 overflow-auto">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-slate-50 ${!notification.isRead ? "bg-sky-50" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    {notification.data?.user ? (
                      <Avatar>
                        <AvatarImage
                          src={notification.data.user?.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={notification.data.user?.name}
                        />
                        <AvatarFallback>{notification.data.user?.name.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {!notification.isRead && <div className="w-2 h-2 rounded-full bg-sky-600"></div>}
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{notification.message}</p>
                    <p className="text-xs text-slate-500">{getTimeAgo(notification.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Bell className="h-12 w-12 text-slate-300 mb-2" />
            <h3 className="font-medium">No notifications</h3>
            <p className="text-sm text-slate-500">
              {activeTab === "all" ? "You don't have any notifications yet" : "No notifications in this category"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
