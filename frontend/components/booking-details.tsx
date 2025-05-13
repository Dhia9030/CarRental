"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Car, DollarSign, User, CheckCircle, XCircle, FileText } from "lucide-react"

interface BookingDetailsProps {
  booking: any
  onStatusChange: (status: string) => void
}

export function BookingDetails({ booking, onStatusChange }: BookingDetailsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "Completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getDuration = () => {
    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Booking #{booking.id}</h3>
          <p className="text-sm text-slate-500">Created on {formatDate(booking.createdAt)}</p>
        </div>
        <div>{getStatusBadge(booking.status)}</div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-sky-600" />
              Renter Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{booking.renter.name}</p>
            <p className="text-sm text-slate-500">{booking.renter.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Car className="h-4 w-4 text-sky-600" />
              Car Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden">
              <img
                src={booking.car.images[0] || "/placeholder.svg"}
                alt={`${booking.car.make} ${booking.car.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">
                {booking.car.make} {booking.car.model}
              </p>
              <p className="text-sm text-slate-500">{booking.car.year}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-600" />
            Rental Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Start Date</p>
              <p className="font-medium">{formatDate(booking.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">End Date</p>
              <p className="font-medium">{formatDate(booking.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Duration</p>
              <p className="font-medium">{getDuration()} days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-sky-600" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm">Daily Rate</p>
              <p className="text-sm font-medium">${booking.totalPrice / getDuration()}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">Duration</p>
              <p className="text-sm font-medium">{getDuration()} days</p>
            </div>
            <Separator />
            <div className="flex justify-between">
              <p>Total Amount</p>
              <p className="font-bold">${booking.totalPrice}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">Payment Status</p>
              <Badge
                variant={booking.isPaid ? "default" : "outline"}
                className={booking.isPaid ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
              >
                {booking.isPaid ? "Paid" : "Unpaid"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 pt-2">
        {booking.status === "Pending" && (
          <>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => onStatusChange("Cancelled")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Booking
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => onStatusChange("Confirmed")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Booking
            </Button>
          </>
        )}
        {booking.status === "Confirmed" && (
          <>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => onStatusChange("Cancelled")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Booking
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700">
              <FileText className="mr-2 h-4 w-4" />
              Generate Contract
            </Button>
          </>
        )}
        {booking.status === "Completed" && (
          <Button className="bg-sky-600 hover:bg-sky-700">
            <FileText className="mr-2 h-4 w-4" />
            View Contract
          </Button>
        )}
      </div>
    </div>
  )
}
