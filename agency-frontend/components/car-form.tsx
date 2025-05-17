"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Car } from "@/types/api-types"

interface CarFormProps {
  car?: Car
  onSubmit: (car: Omit<Car, "id"> | Car) => void
  onCancel: () => void
}

export function CarForm({ car, onSubmit, onCancel }: CarFormProps) {
  const [formData, setFormData] = useState({
    id: car?.id || "",
    make: car?.make || "",
    model: car?.model || "",
    year: car?.year || new Date().getFullYear(),
    type: car?.type || "Sedan",
    seats: car?.seats || 5,
    fuelType: car?.fuelType || "Gasoline",
    pricePerDay: car?.pricePerDay || 100,
    available: car?.available !== undefined ? car.available : true,
    location: car?.location || "",
    description: car?.description || "",
    features: car?.features || [],
    images: car?.images || ["/placeholder.svg?height=200&width=300"],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
  }

  const handleNumberChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: Number.parseInt(value) || 0 })
  }

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value.split(",").map((feature) => feature.trim())
    setFormData({ ...formData, features })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="images">Car Image</Label>
        <div className="border rounded-md p-2">
          <div className="w-full h-40 rounded-md overflow-hidden mb-2">
            <img
              src={formData.images[0] || "/placeholder.svg?height=160&width=300"}
              alt="Car preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Input
            id="imageUrl"
            name="imageUrl"
            placeholder="Enter image URL"
            value={formData.images[0]}
            onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input id="make" name="make" value={formData.make} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" name="model" value={formData.model} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={(e) => handleNumberChange("year", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Hatchback">Hatchback</SelectItem>
              <SelectItem value="Coupe">Coupe</SelectItem>
              <SelectItem value="Convertible">Convertible</SelectItem>
              <SelectItem value="Van">Van</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seats">Seats</Label>
          <Input
            id="seats"
            name="seats"
            type="number"
            value={formData.seats}
            onChange={(e) => handleNumberChange("seats", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select value={formData.fuelType} onValueChange={(value) => handleSelectChange("fuelType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gasoline">Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pricePerDay">Price Per Day ($)</Label>
          <Input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            value={formData.pricePerDay}
            onChange={(e) => handleNumberChange("pricePerDay", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (comma separated)</Label>
        <Input
          id="features"
          name="features"
          value={formData.features.join(", ")}
          onChange={handleFeaturesChange}
          placeholder="Air Conditioning, Bluetooth, GPS, etc."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={formData.available}
          onCheckedChange={(checked) => handleSwitchChange("available", checked)}
        />
        <Label htmlFor="available">Available for Rent</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
          {car ? "Update Car" : "Add Car"}
        </Button>
      </div>
    </form>
  )
}
