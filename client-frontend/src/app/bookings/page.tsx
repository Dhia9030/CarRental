"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, Clock, MapPin, Star, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { getUserBookings, cancelBooking } from "@/lib/api";
import { Booking } from "@/types/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.car?.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.car?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "default";
      case "Pending":
        return "secondary";
      case "Completed":
        return "outline";
      case "Cancelled":
      case "Rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getBookingsByStatus = (status: string) => {
    return filteredBookings.filter((booking) => {
      switch (status) {
        case "active":
          return ["Pending", "Confirmed"].includes(booking.status);
        case "completed":
          return booking.status === "Completed";
        case "cancelled":
          return ["Cancelled", "Rejected"].includes(booking.status);
        default:
          return true;
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <div className="text-sm text-gray-500">
          {filteredBookings.length} booking
          {filteredBookings.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by car or booking ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({filteredBookings.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({getBookingsByStatus("active").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({getBookingsByStatus("completed").length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({getBookingsByStatus("cancelled").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <BookingList
            bookings={filteredBookings}
            onSelectBooking={setSelectedBooking}
            onCancelBooking={handleCancelBooking}
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <BookingList
            bookings={getBookingsByStatus("active")}
            onSelectBooking={setSelectedBooking}
            onCancelBooking={handleCancelBooking}
          />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <BookingList
            bookings={getBookingsByStatus("completed")}
            onSelectBooking={setSelectedBooking}
            onCancelBooking={handleCancelBooking}
          />
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <BookingList
            bookings={getBookingsByStatus("cancelled")}
            onSelectBooking={setSelectedBooking}
            onCancelBooking={handleCancelBooking}
          />
        </TabsContent>
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  Booking ID: {selectedBooking.id}
                </DialogDescription>
              </DialogHeader>
              <BookingDetails booking={selectedBooking} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface BookingListProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
}

function BookingList({
  bookings,
  onSelectBooking,
  onCancelBooking,
}: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-500 mb-4">
            You haven't made any bookings yet.
          </p>
          <Button onClick={() => (window.location.href = "/cars")}>
            Browse Cars
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Car Image */}
              <div className="lg:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden">
                {booking.car?.images?.[0] ? (
                  <img
                    src={booking.car.images[0]}
                    alt={`${booking.car.make} ${booking.car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Booking Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {booking.car?.make} {booking.car?.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {booking.car?.year} • {booking.car?.type}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {format(new Date(booking.startDate), "MMM dd, yyyy")} -{" "}
                      {format(new Date(booking.endDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-semibold">
                      ${booking.totalPrice.toFixed(2)}
                    </span>
                    {booking.isPaid && (
                      <Badge variant="outline" className="text-xs">
                        Paid
                      </Badge>
                    )}
                  </div>
                  {booking.pickupLocation && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{booking.pickupLocation}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectBooking(booking)}>
                    View Details
                  </Button>
                  {["Pending", "Confirmed"].includes(booking.status) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onCancelBooking(booking.id)}>
                      Cancel
                    </Button>
                  )}
                  {booking.status === "Completed" &&
                    !booking.car?.reviews?.some(
                      (r) => r.bookingId === booking.id
                    ) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/cars/${booking.carId}?review=true`)
                        }>
                        Write Review
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BookingDetails({ booking }: { booking: Booking }) {
  return (
    <div className="space-y-6">
      {/* Car Details */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Car Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="font-medium">
              {booking.car?.make} {booking.car?.model} ({booking.car?.year})
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-medium">{booking.car?.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Seats</p>
            <p className="font-medium">{booking.car?.seats} seats</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fuel Type</p>
            <p className="font-medium">{booking.car?.fuelType}</p>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Booking Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">
              {format(new Date(booking.startDate), "EEEE, MMMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium">
              {format(new Date(booking.endDate), "EEEE, MMMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge variant={getStatusBadgeVariant(booking.status)}>
              {booking.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Price</p>
            <p className="font-medium text-lg">
              ${booking.totalPrice.toFixed(2)}
            </p>
          </div>
          {booking.pickupLocation && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Pickup Location</p>
              <p className="font-medium">{booking.pickupLocation}</p>
            </div>
          )}
          {booking.dropoffLocation && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Dropoff Location</p>
              <p className="font-medium">{booking.dropoffLocation}</p>
            </div>
          )}
          {booking.notes && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="font-medium">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Status */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-3">Payment Information</h4>
        <div className="flex items-center justify-between">
          <span>Payment Status:</span>
          <Badge variant={booking.isPaid ? "default" : "secondary"}>
            {booking.isPaid ? "Paid" : "Pending"}
          </Badge>
        </div>
        {booking.paymentId && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Payment ID: {booking.paymentId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "Confirmed":
      return "default";
    case "Pending":
      return "secondary";
    case "Completed":
      return "outline";
    case "Cancelled":
    case "Rejected":
      return "destructive";
    default:
      return "secondary";
  }
}
