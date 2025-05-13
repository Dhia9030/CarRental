/**
 * Car Rental Calendar Component
 *
 * IMPORTANT: This component displays booking dates for a specific car.
 *
 * When implementing with a real API:
 * 1. The bookingDates prop should come from real API data
 * 2. Make sure date formatting is consistent with your backend
 * 3. Consider adding real-time updates for new bookings
 */
"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

interface BookingDate {
  start: Date
  end: Date
  bookingId?: string
  renterName?: string
  status?: string
}

interface CarRentalCalendarProps {
  carId: string
  carName: string
  bookingDates: BookingDate[]
  buttonVariant?: "default" | "outline" | "ghost"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  showAsButton?: boolean
  showAsStatus?: boolean
}

export function CarRentalCalendar({
  carId,
  carName,
  bookingDates,
  buttonVariant = "outline",
  buttonSize = "sm",
  showAsButton = true,
  showAsStatus = false,
}: CarRentalCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isOpen, setIsOpen] = useState(false)

  // REPLACE THIS: In production, these dates will come from your real API

  // Create a map of dates with bookings
  const bookedDates = new Map()

  // REPLACE THIS: In production, this logic might be handled by your backend
  // or you might need to format dates differently based on your API
  bookingDates.forEach((booking) => {
    const start = new Date(booking.start)
    const end = new Date(booking.end)

    // For each day in the booking range
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      const dateString = day.toISOString().split("T")[0]

      if (!bookedDates.has(dateString)) {
        bookedDates.set(dateString, [])
      }

      bookedDates.get(dateString).push({
        bookingId: booking.bookingId,
        renterName: booking.renterName,
        status: booking.status,
      })
    }
  })

  // Inside the isDateBooked function:
  // REPLACE THIS: In production, you might want to optimize this check
  // or handle it differently based on your data structure
  const isDateBooked = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return bookedDates.has(dateString)
  }

  // Inside the getBookingsForDate function:
  // REPLACE THIS: In production, you might fetch this data on-demand
  // from your API rather than pre-computing it
  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return bookedDates.get(dateString) || []
  }

  // Selected date bookings
  const selectedDateBookings = date ? getBookingsForDate(date) : []

  // Count of booked dates
  const bookedDatesCount = bookedDates.size

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {showAsButton ? (
        <DialogTrigger asChild>
          <Button variant={buttonVariant} size={buttonSize}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            View Rental Schedule
          </Button>
        </DialogTrigger>
      ) : showAsStatus ? (
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <Badge
              variant="outline"
              className="bg-sky-50 text-sky-800 hover:bg-sky-100 cursor-pointer flex items-center gap-1"
            >
              <CalendarIcon className="h-3 w-3" />
              {bookedDatesCount} booked {bookedDatesCount === 1 ? "day" : "days"}
            </Badge>
          </div>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <div className="cursor-pointer flex items-center gap-1 text-sky-600 hover:text-sky-800 text-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>
              View {bookedDatesCount} booked {bookedDatesCount === 1 ? "day" : "days"}
            </span>
          </div>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Rental Schedule for {carName}</DialogTitle>
          <DialogDescription>View all booked dates for this vehicle</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 py-4">
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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {date
                    ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                    : "Select a date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateBookings.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateBookings.map((booking, idx) => (
                      <div key={idx} className="p-3 border rounded-md bg-sky-50">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{booking.renterName || "Reserved"}</p>
                          <Badge
                            variant={booking.status === "Confirmed" ? "default" : "outline"}
                            className={
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : booking.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : ""
                            }
                          >
                            {booking.status || "Booked"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No bookings for this date.</p>
                )}
              </CardContent>
            </Card>

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Legend</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-sky-100"></div>
                  <span className="text-sm">Booked Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                  <span className="text-sm">Confirmed Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  <span className="text-sm">Pending Booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
