"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BarChart3, Car, CalendarClock, MessageSquare, LogOut, Calendar, MessageCircle } from "lucide-react"
import { AdminChat } from "@/components/admin-chat"

export function Sidebar() {
  const pathname = usePathname()
  const [showAdminChat, setShowAdminChat] = useState(false)

  return (
    <>
      <div className="w-64 bg-sky-800 text-white p-6 flex flex-col h-screen">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">CarRental Agency</h2>
          <p className="text-sky-200 text-sm">Agency Dashboard</p>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarLink href="/" icon={<BarChart3 size={20} />} label="Dashboard" active={pathname === "/"} />
          <SidebarLink
            href="/cars"
            icon={<Car size={20} />}
            label="Cars"
            active={pathname === "/cars" || pathname.startsWith("/cars/")}
          />
          <SidebarLink
            href="/bookings"
            icon={<CalendarClock size={20} />}
            label="Bookings"
            active={pathname === "/bookings" || pathname.startsWith("/bookings/")}
          />
          <SidebarLink
            href="/reviews"
            icon={<MessageSquare size={20} />}
            label="Reviews"
            active={pathname === "/reviews"}
          />
          <SidebarLink
            href="/calendar"
            icon={<Calendar size={20} />}
            label="Calendar"
            active={pathname === "/calendar"}
          />
        </nav>

        <div className="pt-6 border-t border-sky-700 mt-6 space-y-1">
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sky-100 hover:bg-sky-700/50 w-full text-left"
            onClick={() => setShowAdminChat(true)}
          >
            <MessageCircle size={20} />
            <span>Contact Admin</span>
          </button>
          <SidebarLink href="/logout" icon={<LogOut size={20} />} label="Logout" />
        </div>
      </div>

      {showAdminChat && <AdminChat onClose={() => setShowAdminChat(false)} />}
    </>
  )
}

function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active ? "bg-sky-700 text-white" : "text-sky-100 hover:bg-sky-700/50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
