"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApi } from "@/providers/api-provider"

interface CarBookingCalendarProps {
  carId: string
}

/**
 * CarBookingCalendar Component
 *
 * This component displays a calendar showing booked dates for a specific car.
 * It highlights dates that are booked and shows booking details when a date is selected.
 *
 * @param {string} carId - ID of the car to show bookings for
 */
export function CarBookingCalendar({ carId }: CarBookingCalendarProps) {
  const { cars, getBookingsByCarId } = useApi()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [bookedDates, setBookedDates] = useState<Map<string, any[]>>(new Map())

  const car = cars.find((c) => c.id === carId)
  const bookings = getBookingsByCarId(carId)

  /**
   * Process bookings to create a map of booked dates
   *
   * This effect runs whenever the bookings change.
   * It creates a map where:
   * - Keys are date strings in ISO format (YYYY-MM-DD)
   * - Values are arrays of booking details for that date
   */
  useEffect(() => {
    const datesMap = new Map<string, any[]>()

    bookings.forEach((booking) => {
      const start = new Date(booking.startDate)
      const end = new Date(booking.endDate)

      // For each day in the booking range
      for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
        const dateString = day.toISOString().split("T")[0]

        if (!datesMap.has(dateString)) {
          datesMap.set(dateString, [])
        }

        datesMap.get(dateString)?.push({
          bookingId: booking.id,
          renterName: booking.renter.name,
          status: booking.status,
        })
      }
    })

    setBookedDates(datesMap)
  }, [bookings])

  /**
   * Check if a date is booked
   *
   * @param {Date} date - Date to check
   * @returns {boolean} - True if the date is booked
   */
  const isDateBooked = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return bookedDates.has(dateString)
  }

  /**
   * Get booking details for a date
   *
   * @param {Date} date - Date to get bookings for
   * @returns {any[]} - Array of booking details
   */
  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return bookedDates.get(dateString) || []
  }

  // Selected date bookings
  const selectedDateBookings = date ? getBookingsForDate(date) : []

  return (
    <div className="space-y-4">
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
    </div>
  )
}
