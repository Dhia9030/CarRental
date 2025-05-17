"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Car, Booking, Review } from "@/types/api-types"

// Define the API context type
interface ApiContextType {
  // Cars
  cars: Car[]
  isLoadingCars: boolean
  fetchCars: () => Promise<void>
  addCar: (car: Omit<Car, "id">) => Promise<Car>
  updateCar: (id: string, car: Partial<Car>) => Promise<Car>
  deleteCar: (id: string) => Promise<void>

  // Bookings
  bookings: Booking[]
  isLoadingBookings: boolean
  fetchBookings: () => Promise<void>
  getBookingsByCarId: (carId: string) => Booking[]

  // Reviews
  reviews: Review[]
  isLoadingReviews: boolean
  fetchReviews: () => Promise<void>
  getAverageRating: (carId: string) => number
}

// Create the context
const ApiContext = createContext<ApiContextType | undefined>(undefined)

/**
 * API base URL - replace with your actual API URL
 * This should be set in your environment variables:
 * NEXT_PUBLIC_API_URL=https://your-api-url.com/api
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-api-url.com/api"

/**
 * ApiProvider Component
 *
 * This provider handles all API interactions for the application.
 * It provides methods for fetching, creating, updating, and deleting data.
 *
 * @param {ReactNode} children - Child components
 */
export function ApiProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  const [isLoadingCars, setIsLoadingCars] = useState(false)
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)

  /**
   * Generic API fetch function with error handling
   *
   * @param {string} endpoint - API endpoint to fetch from
   * @param {RequestInit} options - Fetch options
   * @returns {Promise<T>} - Parsed response data
   */
  const fetchAPI = async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
    try {
      // You should add your authentication token here
      const token = localStorage.getItem("authToken") // Example: get token from localStorage

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          // Add authentication header if token exists
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * Fetch all cars from the API
   *
   * Endpoint: GET /cars
   * Response: Array of Car objects
   */
  const fetchCars = useCallback(async () => {
    setIsLoadingCars(true)
    try {
      const data = await fetchAPI<Car[]>("/cars")
      setCars(data)
    } catch (error) {
      console.error("Error fetching cars:", error)
      // In a real app, you might want to handle this error more gracefully
    } finally {
      setIsLoadingCars(false)
    }
  }, [])

  /**
   * Add a new car
   *
   * Endpoint: POST /cars
   * Request: Car object without ID
   * Response: Complete Car object with ID
   */
  const addCar = useCallback(async (car: Omit<Car, "id">) => {
    try {
      const newCar = await fetchAPI<Car>("/cars", {
        method: "POST",
        body: JSON.stringify(car),
      })
      setCars((prev) => [...prev, newCar])
      return newCar
    } catch (error) {
      console.error("Error adding car:", error)
      throw error
    }
  }, [])

  /**
   * Update an existing car
   *
   * Endpoint: PATCH /cars/:id
   * Request: Partial Car object
   * Response: Updated Car object
   */
  const updateCar = useCallback(async (id: string, car: Partial<Car>) => {
    try {
      const updatedCar = await fetchAPI<Car>(`/cars/${id}`, {
        method: "PATCH",
        body: JSON.stringify(car),
      })
      setCars((prev) => prev.map((c) => (c.id === id ? updatedCar : c)))
      return updatedCar
    } catch (error) {
      console.error("Error updating car:", error)
      throw error
    }
  }, [])

  /**
   * Delete a car
   *
   * Endpoint: DELETE /cars/:id
   * Response: Success message
   */
  const deleteCar = useCallback(async (id: string) => {
    try {
      await fetchAPI("/cars/" + id, {
        method: "DELETE",
      })
      setCars((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Error deleting car:", error)
      throw error
    }
  }, [])

  /**
   * Fetch all bookings
   *
   * Endpoint: GET /bookings
   * Response: Array of Booking objects
   */
  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true)
    try {
      const data = await fetchAPI<Booking[]>("/bookings")
      setBookings(data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoadingBookings(false)
    }
  }, [])

  /**
   * Get bookings for a specific car
   *
   * @param {string} carId - ID of the car to get bookings for
   * @returns {Booking[]} - Array of bookings for the car
   */
  const getBookingsByCarId = useCallback(
    (carId: string) => {
      return bookings.filter((booking) => booking.carId === carId)
    },
    [bookings],
  )

  /**
   * Fetch all reviews
   *
   * Endpoint: GET /reviews
   * Response: Array of Review objects
   */
  const fetchReviews = useCallback(async () => {
    setIsLoadingReviews(true)
    try {
      const data = await fetchAPI<Review[]>("/reviews")
      setReviews(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoadingReviews(false)
    }
  }, [])

  /**
   * Calculate average rating for a car
   *
   * @param {string} carId - ID of the car to calculate rating for
   * @returns {number} - Average rating (0-5)
   */
  const getAverageRating = useCallback(
    (carId: string) => {
      const carReviews = reviews.filter((review) => review.carId === carId)
      if (carReviews.length === 0) return 0

      const sum = carReviews.reduce((acc, review) => acc + review.rating, 0)
      return Number.parseFloat((sum / carReviews.length).toFixed(1))
    },
    [reviews],
  )

  // Load initial data
  React.useEffect(() => {
    fetchCars()
    fetchBookings()
    fetchReviews()
  }, [fetchCars, fetchBookings, fetchReviews])

  const value = {
    cars,
    isLoadingCars,
    fetchCars,
    addCar,
    updateCar,
    deleteCar,

    bookings,
    isLoadingBookings,
    fetchBookings,
    getBookingsByCarId,

    reviews,
    isLoadingReviews,
    fetchReviews,
    getAverageRating,
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

/**
 * Custom hook to use the API context
 *
 * @returns {ApiContextType} - API context value
 * @throws {Error} - If used outside of ApiProvider
 */
export function useApi() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider")
  }
  return context
}
