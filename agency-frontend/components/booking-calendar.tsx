"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BookingCalendarProps {
  bookings: {
    id: string
    startDate: Date
    endDate: Date
    renterName: string
    status: string
  }[]
}

export function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Create a map of dates with bookings
  const bookedDates = new Map()

  bookings.forEach((booking) => {
    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)

    // For each day in the booking range
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      const dateString = day.toISOString().split("T")[0]

      if (!bookedDates.has(dateString)) {
        bookedDates.set(dateString, [])
      }

      bookedDates.get(dateString).push({
        id: booking.id,
        renterName: booking.renterName,
        status: booking.status,
      })
    }
  })

  // Function to determine if a date is booked
  const isDateBooked = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return bookedDates.has(dateString)
  }

  // Function to get booking details for a date
  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return bookedDates.get(dateString) || []
  }

  // Selected date bookings
  const selectedDateBookings = date ? getBookingsForDate(date) : []

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Booking Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  booked: (date) => isDateBooked(date),
                }}
                modifiersStyles={{
                  booked: { backgroundColor: "rgba(14, 165, 233, 0.1)", color: "rgb(3, 105, 161)", fontWeight: "bold" },
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">
                {date
                  ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                  : "Select a date"}
              </h3>

              {selectedDateBookings.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateBookings.map((booking, idx) => (
                    <div key={idx} className="p-3 border rounded-md bg-sky-50">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{booking.renterName}</p>
                        <Badge
                          variant={booking.status === "Confirmed" ? "default" : "outline"}
                          className={
                            booking.status === "Confirmed" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No bookings for this date.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
