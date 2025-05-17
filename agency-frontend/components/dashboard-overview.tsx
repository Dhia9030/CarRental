"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Car, CalendarClock, Star, DollarSign } from "lucide-react"
import { useApi } from "@/providers/api-provider"

export function DashboardOverview() {
  const { cars, bookings, reviews } = useApi()
  const [stats, setStats] = useState({
    totalCars: 0,
    rentedCars: 0,
    totalBookings: 0,
    averageRating: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    // Calculate dashboard statistics
    const rentedCars = cars.filter((car) => !car.available).length

    // Calculate average rating across all reviews
    let avgRating = 0
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
      avgRating = Number.parseFloat((sum / reviews.length).toFixed(1))
    }

    // Calculate total revenue from confirmed bookings
    const revenue = bookings
      .filter((booking) => booking.status === "Confirmed" || booking.status === "Completed")
      .reduce((acc, booking) => acc + booking.totalPrice, 0)

    setStats({
      totalCars: cars.length,
      rentedCars,
      totalBookings: bookings.length,
      averageRating: avgRating,
      totalRevenue: revenue,
    })
  }, [cars, bookings, reviews])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Agency Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/cars" className="block">
          <StatCard
            title="Total Cars"
            value={stats.totalCars.toString()}
            description="Available in fleet"
            icon={<Car className="h-5 w-5 text-sky-600" />}
          />
        </Link>
        <Link href="/bookings" className="block">
          <StatCard
            title="Rented Cars"
            value={stats.rentedCars.toString()}
            description="Currently rented"
            icon={<CalendarClock className="h-5 w-5 text-sky-600" />}
          />
        </Link>
        <Link href="/reviews" className="block">
          <StatCard
            title="Average Rating"
            value={stats.averageRating.toString()}
            description="From customer reviews"
            icon={<Star className="h-5 w-5 text-sky-600" />}
          />
        </Link>
        <Link href="/bookings" className="block">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue}`}
            description="From confirmed bookings"
            icon={<DollarSign className="h-5 w-5 text-sky-600" />}
          />
        </Link>
      </div>

      <div className="p-6 bg-white rounded-lg border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/cars"
            className="p-4 bg-sky-50 rounded-lg border border-sky-100 hover:bg-sky-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <Car className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h3 className="font-medium">Manage Cars</h3>
                <p className="text-sm text-slate-500">Add, edit or remove cars</p>
              </div>
            </div>
          </Link>
          <Link
            href="/bookings"
            className="p-4 bg-sky-50 rounded-lg border border-sky-100 hover:bg-sky-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <CalendarClock className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h3 className="font-medium">Manage Bookings</h3>
                <p className="text-sm text-slate-500">View and update bookings</p>
              </div>
            </div>
          </Link>
          <Link
            href="/calendar"
            className="p-4 bg-sky-50 rounded-lg border border-sky-100 hover:bg-sky-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <CalendarClock className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h3 className="font-medium">View Calendar</h3>
                <p className="text-sm text-slate-500">See all bookings in calendar view</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card className="hover:border-sky-200 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="h-12 w-12 rounded-full bg-sky-50 flex items-center justify-center">{icon}</div>
        </div>
        <div className="space-y-1">
          <h3 className="text-3xl font-bold">{value}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
