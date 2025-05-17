"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Car, DollarSign, MapPin, Star, Users, Fuel, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApi } from "@/providers/api-provider"
import { CarBookingCalendar } from "@/components/car-booking-calendar"
import { CarReviews } from "@/components/car-reviews"

interface CarDetailsProps {
  id: string
}

export function CarDetails({ id }: CarDetailsProps) {
  const { cars, getAverageRating } = useApi()
  const [selectedImage, setSelectedImage] = useState(0)

  const car = cars.find((c) => c.id === id)

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-2">Car Not Found</h2>
        <p className="text-slate-500 mb-4">The car you're looking for doesn't exist or has been removed.</p>
        <Link href="/cars">
          <Button variant="outline">Back to Cars</Button>
        </Link>
      </div>
    )
  }

  const averageRating = getAverageRating(id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/cars">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Cars
          </Button>
        </Link>
        <Badge
          variant={car.available ? "default" : "outline"}
          className={car.available ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
        >
          {car.available ? "Available" : "Rented"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-lg overflow-hidden border bg-white">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={car.images[selectedImage] || "/placeholder.svg?height=300&width=600"}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 flex gap-2 overflow-x-auto">
              {car.images.map((image, index) => (
                <div
                  key={index}
                  className={`w-24 h-16 rounded overflow-hidden cursor-pointer border-2 ${
                    selectedImage === index ? "border-sky-500" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg?height=64&width=96"}
                    alt={`${car.make} ${car.model} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="bg-sky-50 border border-sky-100">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="calendar">Availability Calendar</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-4 bg-white rounded-lg border mt-2">
              <div className="space-y-4">
                <p className="text-sm leading-relaxed">{car.description}</p>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-sky-600" />
                    <div>
                      <p className="text-sm font-medium">Year</p>
                      <p className="text-sm text-slate-500">{car.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-sky-600" />
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm text-slate-500">{car.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-sky-600" />
                    <div>
                      <p className="text-sm font-medium">Seats</p>
                      <p className="text-sm text-slate-500">{car.seats}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-sky-600" />
                    <div>
                      <p className="text-sm font-medium">Fuel Type</p>
                      <p className="text-sm text-slate-500">{car.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-sky-600" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-slate-500">{car.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-sky-600" />
                    <div>
                      <p className="text-sm font-medium">Rating</p>
                      <p className="text-sm text-slate-500">{averageRating}/5</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="features" className="p-4 bg-white rounded-lg border mt-2">
              <div className="grid grid-cols-2 gap-2">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-sky-500"></div>
                    <p className="text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="calendar" className="p-4 bg-white rounded-lg border mt-2">
              <div className="space-y-4">
                <h3 className="font-medium">Availability Calendar</h3>
                <p className="text-sm text-slate-500">
                  Check the calendar below to see when this car is available for booking.
                </p>
                <div className="mt-4">
                  <CarBookingCalendar carId={car.id} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="p-4 bg-white rounded-lg border mt-2">
              <CarReviews carId={car.id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {car.make} {car.model}
              </CardTitle>
              <CardDescription>
                {car.year} • {car.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-5 w-5 text-sky-600" />
                  <span className="text-2xl font-bold">${car.pricePerDay}</span>
                </div>
                <span className="text-sm text-slate-500">per day</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="text-lg font-medium">{averageRating}</span>
                  <span className="text-sm text-slate-500">/ 5</span>
                </div>
                <Badge className="bg-sky-100 text-sky-800">
                  {car.available ? "Available Now" : "Currently Rented"}
                </Badge>
              </div>

              <div className="pt-2 space-y-2">
                <Button className="w-full bg-sky-600 hover:bg-sky-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Booking Calendar
                </Button>

                <Button variant="outline" className="w-full">
                  <Info className="mr-2 h-4 w-4" />
                  Request Information
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Agency Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                  <span className="font-bold text-sky-600">PM</span>
                </div>
                <div>
                  <p className="font-medium">Premium Motors</p>
                  <div className="flex items-center text-sm text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500" />
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span className="ml-1 text-slate-500">5.0</span>
                  </div>
                  <p className="text-xs text-slate-500">Member since 2020</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
