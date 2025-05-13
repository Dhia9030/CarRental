import { BookingCalendar } from "@/components/booking-calendar"

// Mock data for bookings
const bookingsMockData = [
  {
    id: "1",
    startDate: new Date("2023-06-10"),
    endDate: new Date("2023-06-15"),
    renterName: "John Smith",
    status: "Confirmed",
  },
  {
    id: "2",
    startDate: new Date("2023-06-20"),
    endDate: new Date("2023-06-25"),
    renterName: "Sarah Johnson",
    status: "Confirmed",
  },
  {
    id: "3",
    startDate: new Date("2023-07-05"),
    endDate: new Date("2023-07-10"),
    renterName: "Michael Brown",
    status: "Pending",
  },
  {
    id: "4",
    startDate: new Date("2023-07-15"),
    endDate: new Date("2023-07-20"),
    renterName: "Emily Davis",
    status: "Confirmed",
  },
  {
    id: "5",
    startDate: new Date("2023-08-01"),
    endDate: new Date("2023-08-05"),
    renterName: "David Wilson",
    status: "Pending",
  },
]

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Booking Calendar</h1>
      <BookingCalendar bookings={bookingsMockData} />
    </div>
  )
}
