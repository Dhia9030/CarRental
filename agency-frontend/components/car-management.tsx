"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Edit, Trash, Eye, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CarForm } from "@/components/car-form"
import { useApi } from "@/providers/api-provider"
import { toast } from "@/components/ui/use-toast"
import { CarBookingCalendar } from "@/components/car-booking-calendar"

export function CarManagement() {
  const { cars, isLoadingCars, fetchCars, addCar, updateCar, deleteCar, getAverageRating } = useApi()

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddCarOpen, setIsAddCarOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null)
  const [editingCar, setEditingCar] = useState<any>(null)

  const filteredCars = cars.filter(
    (car) =>
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCar = async (newCar: any) => {
    try {
      await addCar(newCar)
      toast({
        title: "Car Added",
        description: "The car has been added successfully.",
      })
      setIsAddCarOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add car. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCar = async (updatedCar: any) => {
    try {
      await updateCar(updatedCar.id, updatedCar)
      toast({
        title: "Car Updated",
        description: "The car has been updated successfully.",
      })
      setEditingCar(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update car. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCar = async (id: string) => {
    try {
      await deleteCar(id)
      toast({
        title: "Car Deleted",
        description: "The car has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete car. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openCalendar = (carId: string) => {
    setSelectedCarId(carId)
    setIsCalendarOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Car Management</CardTitle>
            <CardDescription>Manage your car listings</CardDescription>
          </div>
          <Dialog open={isAddCarOpen} onOpenChange={setIsAddCarOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sky-600 hover:bg-sky-700">
                <Plus className="mr-2 h-4 w-4" />
                Add New Car
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Car</DialogTitle>
              </DialogHeader>
              <CarForm onSubmit={handleAddCar} onCancel={() => setIsAddCarOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search cars..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoadingCars ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.length > 0 ? (
                    filteredCars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-8 rounded bg-sky-100 flex items-center justify-center overflow-hidden">
                              <img
                                src={car.images[0] || "/placeholder.svg?height=32&width=48"}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p>
                                {car.make} {car.model}
                              </p>
                              <p className="text-xs text-slate-500">{car.location}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{car.year}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{car.type}</span>
                            <span className="text-xs text-slate-500">{car.seats} seats</span>
                          </div>
                        </TableCell>
                        <TableCell>${car.pricePerDay}</TableCell>
                        <TableCell>
                          <Badge
                            variant={car.available ? "default" : "outline"}
                            className={car.available ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                          >
                            {car.available ? "Available" : "Rented"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-1">{getAverageRating(car.id)}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4 text-amber-500"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
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
                              <Link href={`/cars/${car.id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem className="cursor-pointer" onClick={() => openCalendar(car.id)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>View Bookings</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={() => setEditingCar(car)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onClick={() => handleDeleteCar(car.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        {searchTerm ? "No cars match your search" : "No cars found. Add your first car!"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Car Dialog */}
      {editingCar && (
        <Dialog open={!!editingCar} onOpenChange={(open) => !open && setEditingCar(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Car</DialogTitle>
            </DialogHeader>
            <CarForm car={editingCar} onSubmit={handleUpdateCar} onCancel={() => setEditingCar(null)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Booking Calendar Dialog */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Booking Calendar</DialogTitle>
          </DialogHeader>
          {selectedCarId && <CarBookingCalendar carId={selectedCarId} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
