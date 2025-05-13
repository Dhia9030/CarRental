"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Eye, CheckCircle, XCircle, FileText, RefreshCw } from "lucide-react"
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
import { useAppContext } from "@/contexts/AppContext"

/**
 * Booking Management Component
 *
 * IMPORTANT: This component currently uses mock data from the AppContext.
 *
 * When implementing with a real API:
 * 1. The useAppContext hook will fetch real booking data from your API
 * 2. The handleStatusChange function will update real booking statuses
 * 3. The refund process will integrate with the real Flouci API
 */

// Mock data for bookings
const bookingsMockData = [
  {
    id: "1",
    renter: {
      id: "u1",
      name: "John Smith",
      email: "john@example.com",
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
    status: "Confirmed",
    isPaid: true,
    paymentId: "FL-123456789",
    createdAt: new Date("2023-06-01"),
  },
  {
    id: "2",
    renter: {
      id: "u2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
    },
    car: {
      id: "c2",
      make: "BMW",
      model: "X5",
      year: 2021,
      images: ["https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2564&auto=format&fit=crop"],
    },
    startDate: new Date("2023-06-20"),
    endDate: new Date("2023-06-25"),
    totalPrice: 750,
    status: "Pending",
    isPaid: true,
    paymentId: "FL-987654321",
    createdAt: new Date("2023-06-05"),
  },
  {
    id: "3",
    renter: {
      id: "u3",
      name: "Michael Brown",
      email: "michael@example.com",
    },
    car: {
      id: "c3",
      make: "Mercedes",
      model: "E-Class",
      year: 2022,
      images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop"],
    },
    startDate: new Date("2023-06-15"),
    endDate: new Date("2023-06-18"),
    totalPrice: 420,
    status: "Completed",
    isPaid: true,
    paymentId: "FL-456789123",
    createdAt: new Date("2023-06-02"),
  },
  {
    id: "4",
    renter: {
      id: "u4",
      name: "Emily Davis",
      email: "emily@example.com",
    },
    car: {
      id: "c4",
      make: "Audi",
      model: "Q7",
      year: 2021,
      images: ["https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=2070&auto=format&fit=crop"],
    },
    startDate: new Date("2023-06-25"),
    endDate: new Date("2023-06-30"),
    totalPrice: 800,
    status: "Pending",
    isPaid: true,
    paymentId: "FL-789123456",
    createdAt: new Date("2023-06-10"),
  },
  {
    id: "5",
    renter: {
      id: "u5",
      name: "David Wilson",
      email: "david@example.com",
    },
    car: {
      id: "c5",
      make: "Toyota",
      model: "Camry",
      year: 2022,
      images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2070&auto=format&fit=crop"],
    },
    startDate: new Date("2023-06-12"),
    endDate: new Date("2023-06-14"),
    totalPrice: 180,
    status: "Rejected",
    isPaid: false,
    paymentId: "FL-321654987",
    createdAt: new Date("2023-06-08"),
  },
]

export function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [isRefunding, setIsRefunding] = useState(false)

  // REPLACE THIS: In production, this will use real data from your API
  const { state, updateBooking } = useAppContext()
  const { bookings } = state

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.renter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // REPLACE THIS: In production, this will make real API calls to update the booking
  // and process refunds through Flouci if needed
  const handleStatusChange = (bookingId: string, newStatus: string) => {
    if (newStatus === "Rejected") {
      const booking = bookings.find((b) => b.id === bookingId)
      if (booking && booking.isPaid) {
        // Process refund
        setIsRefunding(true)

        // REPLACE THIS: In production, this will make a real API call to Flouci for refund
        setTimeout(() => {
          setIsRefunding(false)
          updateBooking(bookingId, { status: newStatus, isPaid: false })
          toast({
            title: "Refund Processed",
            description: `Payment has been refunded to the customer.`,
          })
        }, 2000)
      } else {
        updateBooking(bookingId, { status: newStatus })
      }
    } else {
      updateBooking(bookingId, { status: newStatus })
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
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Booking Management</CardTitle>
            <CardDescription>Manage your car bookings</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search bookings..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Renter</TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{booking.renter.name}</p>
                        <p className="text-xs text-slate-500">{booking.renter.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden">
                          <img
                            src={booking.car.images[0] || "/placeholder.svg"}
                            alt={`${booking.car.make} ${booking.car.model}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p>
                            {booking.car.make} {booking.car.model}
                          </p>
                          <p className="text-xs text-slate-500">{booking.car.year}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{formatDate(booking.startDate)}</p>
                        <p className="text-xs text-slate-500">to {formatDate(booking.endDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell>${booking.totalPrice}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={booking.isPaid ? "default" : "outline"}
                        className={booking.isPaid ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {booking.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/bookings/${booking.id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                          </Link>
                          {booking.status === "Pending" && (
                            <>
                              <DropdownMenuItem
                                className="cursor-pointer text-green-600"
                                onClick={() => {
                                  setSelectedBookingId(booking.id)
                                  setIsConfirmDialogOpen(true)
                                }}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Confirm</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onClick={() => {
                                  setSelectedBookingId(booking.id)
                                  setIsRejectDialogOpen(true)
                                }}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Reject</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          {booking.status === "Confirmed" && (
                            <DropdownMenuItem className="cursor-pointer">
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Generate Contract</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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
                if (selectedBookingId) {
                  handleStatusChange(selectedBookingId, "Confirmed")
                }
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
                if (selectedBookingId) {
                  handleStatusChange(selectedBookingId, "Rejected")
                }
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
