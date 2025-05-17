"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Car, DollarSign, User, CheckCircle, XCircle, FileText, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock data for a single booking
const bookingData = {
  id: "1",
  renter: {
    id: "u1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
  },
  car: {
    id: "c1",
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    images: ["https://images.unsplash.com/photo-1619767886558-efdc7b9af5a6?q=80&w=2070&auto=format&fit=crop"],
  },
  startDate: new Date("2023-06-10"),
  endDate: new Date("2023-06-15"),
  totalPrice: 600,
  status: "Pending", // Changed to Pending to match the new flow
  isPaid: true,
  paymentMethod: "Flouci",
  paymentId: "FL-123456789",
  createdAt: new Date("2023-06-01"),
  notes: "Customer requested airport pickup. Prefers contactless handover if possible.",
}

export function BookingDetails({ id }: { id: string }) {
  const [booking, setBooking] = useState(bookingData) // In a real app, you would fetch the booking by ID
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isRefunding, setIsRefunding] = useState(false)

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "Rejected" && booking.isPaid) {
      // Process refund
      setIsRefunding(true)

      // Simulate API call to Flouci for refund
      setTimeout(() => {
        setIsRefunding(false)
        setBooking({ ...booking, status: newStatus, isPaid: false })
        toast({
          title: "Refund Processed",
          description: `Payment ${booking.paymentId} has been refunded to the customer.`,
        })
      }, 2000)
    } else {
      setBooking({ ...booking, status: newStatus })
      toast({
        title: "Booking Updated",
        description: `Booking status changed to ${newStatus}.`,
      })
    }
  }

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
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/bookings">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Bookings
          </Button>
        </Link>
        {getStatusBadge(booking.status)}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Booking #{booking.id}</h3>
                    <p className="text-sm text-slate-500">Created on {formatDate(booking.createdAt)}</p>
                  </div>
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
                      <p className="text-sm text-slate-500">{booking.renter.phone}</p>
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
                      {booking.isPaid && (
                        <div className="flex justify-between">
                          <p className="text-sm">Payment Method</p>
                          <p className="text-sm">
                            {booking.paymentMethod} (ID: {booking.paymentId})
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {booking.notes && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{booking.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.status === "Pending" && (
                <>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setIsConfirmDialogOpen(true)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={() => setIsRejectDialogOpen(true)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Booking
                  </Button>
                </>
              )}

              {booking.status === "Confirmed" && (
                <>
                  <Button className="w-full bg-sky-600 hover:bg-sky-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Contract
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleStatusChange("Completed")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                </>
              )}

              {booking.status === "Rejected" && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm text-red-800">
                    This booking was rejected and the payment has been refunded to the customer.
                  </p>
                </div>
              )}

              {booking.status === "Completed" && (
                <Button className="w-full bg-sky-600 hover:bg-sky-700">
                  <FileText className="mr-2 h-4 w-4" />
                  View Contract
                </Button>
              )}

              <Link href={`/cars/${booking.car.id}`} className="block">
                <Button variant="outline" className="w-full">
                  <Car className="mr-2 h-4 w-4" />
                  View Car Details
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {booking.isPaid ? (
                  <>
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <p className="font-medium">Payment Received</p>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Payment ID:</span> {booking.paymentId}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Method:</span> {booking.paymentMethod}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Amount:</span> ${booking.totalPrice}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {formatDate(booking.createdAt)}
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <p className="font-medium">No Payment</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-1 bg-green-100 rounded relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Booking Created</p>
                    <p className="text-xs text-slate-500">{formatDate(booking.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1 bg-green-100 rounded relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Received</p>
                    <p className="text-xs text-slate-500">{formatDate(booking.createdAt)}</p>
                  </div>
                </div>
                {booking.status !== "Pending" && (
                  <div className="flex gap-2">
                    <div className="w-1 bg-green-100 rounded relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Booking {booking.status === "Rejected" ? "Rejected" : "Confirmed"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(new Date(booking.createdAt.getTime() + 86400000))}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm this booking? This will notify the customer that their booking has been
              approved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleStatusChange("Confirmed")
                setIsConfirmDialogOpen(false)
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this booking? This will automatically refund the payment to the customer
              via Flouci.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleStatusChange("Rejected")
                setIsRejectDialogOpen(false)
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isRefunding}
            >
              {isRefunding ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing Refund...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject & Refund
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
