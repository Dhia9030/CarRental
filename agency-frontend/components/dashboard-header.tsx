"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { NotificationPanel } from "@/components/notification-panel"
import { useNotifications } from "@/providers/notification-provider"

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const { unreadCount } = useNotifications()

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Agency Dashboard</h1>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-sky-500">
                {unreadCount}
              </Badge>
            )}
          </Button>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">Premium Motors</p>
              <p className="text-xs text-slate-500">Agency Account</p>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Agency Logo" />
              <AvatarFallback>PM</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
    </header>
  )
}
