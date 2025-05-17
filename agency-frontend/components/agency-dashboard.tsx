"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardOverview } from "@/components/dashboard-overview"
import { CarManagement } from "@/components/car-management"
import { BookingManagement } from "@/components/booking-management"
import { ReviewManagement } from "@/components/review-management"
import { Sidebar } from "@/components/sidebar"
import { NotificationPanel } from "@/components/notification-panel"

export function AgencyDashboard() {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader onNotificationClick={() => setShowNotifications(!showNotifications)} notificationCount={3} />
        <div className="flex-1 p-6 bg-slate-50">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-sky-50 border border-sky-100">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cars">Cars</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <DashboardOverview />
            </TabsContent>
            <TabsContent value="cars" className="space-y-4">
              <CarManagement />
            </TabsContent>
            <TabsContent value="bookings" className="space-y-4">
              <BookingManagement />
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4">
              <ReviewManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
    </div>
  )
}
