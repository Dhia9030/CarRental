"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { carsAPI, reviewsAPI, bookingsAPI } from "@/lib/api";
import type { Car, Review } from "@/types/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CarIcon,
  Users,
  Fuel,
  Star,
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Shield,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.id as string;

  const [car, setCar] = useState<Car | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (carId) {
      loadCarDetails();
      loadCarReviews();
    }
  }, [carId]);

  const loadCarDetails = async () => {
    try {
      setLoading(true);
      const carData = await carsAPI.getCarById(carId);
      setCar(carData);
    } catch (error) {
      console.error("Failed to load car details:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCarReviews = async () => {
    try {
      const reviewsData = await carsAPI.getCarReviews(carId);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  };

  const handleBooking = async () => {
    if (!startDate || !endDate || !car) return;

    try {
      setBookingLoading(true);
      await bookingsAPI.createBooking({
        carId: car.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      router.push("/bookings?success=true");
    } catch (error) {
      console.error("Failed to create booking:", error);
      // Show error message
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!startDate || !endDate || !car) return 0;
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days * car.pricePerDay;
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-12">
        <CarIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">
          Car not found
        </h2>
        <p className="text-gray-500 mb-6">
          The car you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/cars">Back to Cars</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/cars">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cars
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {car.company} {car.model}
            </h1>
            <p className="text-lg text-gray-600">
              {car.year} • {car.location}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}>
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Car Image */}
          <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
            <div className="relative h-80 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <CarIcon className="h-32 w-32 text-blue-400" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-blue-600 hover:bg-blue-700">
                  {formatCurrency(car.pricePerDay)}/day
                </Badge>
              </div>
              {car.pricePerDay < 50 && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Great Deal
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Car Details */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="font-semibold">{car.seats}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Fuel className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Fuel Type</p>
                  <p className="font-semibold capitalize">{car.fuelType}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="font-semibold">{car.year}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-xs">{car.location}</p>
                </div>
              </div>

              {car.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{car.description}</p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Air Conditioning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">GPS Navigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Bluetooth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Safety Features</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agency Info */}
          {car.agency && (
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Rental Agency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {car.agency.companyName}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      {car.agency.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{car.agency.email}</span>
                        </div>
                      )}
                      {car.agency.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{car.agency.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Customer Reviews</CardTitle>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {review.user?.firstName?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {review.user?.firstName} {review.user?.lastName}
                            </span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < (review.value || review.rating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.description && (
                            <p className="text-sm text-gray-600">
                              {review.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full">
                      View All Reviews ({reviews.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No reviews yet for this car</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Book This Car
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Pick-up Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {startDate ? formatDate(startDate) : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Return Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {endDate ? formatDate(endDate) : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => {
                          if (date < new Date()) return true;
                          if (startDate && date <= startDate) return true;
                          return false;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {startDate && endDate && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>
                      {Math.ceil(
                        (endDate.getTime() - startDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                    <span>× {formatCurrency(car.pricePerDay)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              )}

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!startDate || !endDate || bookingLoading}
                onClick={handleBooking}>
                {bookingLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Book Now"
                )}
              </Button>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Secure booking • Free cancellation</span>
              </div>
            </CardContent>
          </Card>

          {/* Price Info */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(car.pricePerDay)}
                </div>
                <div className="text-sm text-gray-600">per day</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
