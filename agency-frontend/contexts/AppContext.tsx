"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { AppState, Car, Booking, Review } from "./types"
import { bookingsAPI, reviewsAPI } from "./api-utils"

/**
 * Application Context for state management
 *
 * IMPORTANT: This context provides global state management for the application.
 * Currently using mock data and simulated API calls.
 *
 * When implementing with a real API:
 * 1. Remove the mock data initialization
 * 2. Ensure the API calls in api-utils.ts are properly configured
 * 3. Update the reducer to handle your actual API responses
 * 4. Add proper error handling for API failures
 */

// Initial state
const initialState: AppState = {
  cars: [],
  bookings: [],
  reviews: [],
  loading: {
    cars: false,
    bookings: false,
    reviews: false,
  },
  error: {
    cars: null,
    bookings: null,
    reviews: null,
  },
}

// Action types
type Action =
  | { type: "FETCH_CARS_START" }
  | { type: "FETCH_CARS_SUCCESS"; payload: Car[] }
  | { type: "FETCH_CARS_ERROR"; payload: Error }
  | { type: "FETCH_BOOKINGS_START" }
  | { type: "FETCH_BOOKINGS_SUCCESS"; payload: Booking[] }
  | { type: "FETCH_BOOKINGS_ERROR"; payload: Error }
  | { type: "FETCH_REVIEWS_START" }
  | { type: "FETCH_REVIEWS_SUCCESS"; payload: Review[] }
  | { type: "FETCH_REVIEWS_ERROR"; payload: Error }
  | { type: "ADD_CAR"; payload: Car }
  | { type: "UPDATE_CAR"; payload: Car }
  | { type: "DELETE_CAR"; payload: string }
  | { type: "ADD_BOOKING"; payload: Booking }
  | { type: "UPDATE_BOOKING"; payload: Booking }
  | { type: "DELETE_BOOKING"; payload: string }
  | { type: "ADD_REVIEW"; payload: Review }
  | { type: "UPDATE_REVIEW"; payload: Review }
  | { type: "DELETE_REVIEW"; payload: string }

// Reducer function
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "FETCH_CARS_START":
      return {
        ...state,
        loading: { ...state.loading, cars: true },
        error: { ...state.error, cars: null },
      }
    case "FETCH_CARS_SUCCESS":
      return {
        ...state,
        cars: action.payload,
        loading: { ...state.loading, cars: false },
      }
    case "FETCH_CARS_ERROR":
      return {
        ...state,
        loading: { ...state.loading, cars: false },
        error: { ...state.error, cars: action.payload },
      }
    case "FETCH_BOOKINGS_START":
      return {
        ...state,
        loading: { ...state.loading, bookings: true },
        error: { ...state.error, bookings: null },
      }
    case "FETCH_BOOKINGS_SUCCESS":
      return {
        ...state,
        bookings: action.payload,
        loading: { ...state.loading, bookings: false },
      }
    case "FETCH_BOOKINGS_ERROR":
      return {
        ...state,
        loading: { ...state.loading, bookings: false },
        error: { ...state.error, bookings: action.payload },
      }
    case "FETCH_REVIEWS_START":
      return {
        ...state,
        loading: { ...state.loading, reviews: true },
        error: { ...state.error, reviews: null },
      }
    case "FETCH_REVIEWS_SUCCESS":
      return {
        ...state,
        reviews: action.payload,
        loading: { ...state.loading, reviews: false },
      }
    case "FETCH_REVIEWS_ERROR":
      return {
        ...state,
        loading: { ...state.loading, reviews: false },
        error: { ...state.error, reviews: action.payload },
      }
    case "ADD_CAR":
      return {
        ...state,
        cars: [...state.cars, action.payload],
      }
    case "UPDATE_CAR":
      return {
        ...state,
        cars: state.cars.map((car) => (car.id === action.payload.id ? action.payload : car)),
      }
    case "DELETE_CAR":
      return {
        ...state,
        cars: state.cars.filter((car) => car.id !== action.payload),
      }
    case "ADD_BOOKING":
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
      }
    case "UPDATE_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((booking) => (booking.id === action.payload.id ? action.payload : booking)),
      }
    case "DELETE_BOOKING":
      return {
        ...state,
        bookings: state.bookings.filter((booking) => booking.id !== action.payload),
      }
    case "ADD_REVIEW":
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      }
    case "UPDATE_REVIEW":
      return {
        ...state,
        reviews: state.reviews.map((review) => (review.id === action.payload.id ? action.payload : review)),
      }
    case "DELETE_REVIEW":
      return {
        ...state,
        reviews: state.reviews.filter((review) => review.id !== action.payload),
      }
    default:
      return state
  }
}

// Create context
type AppContextType = {
  state: AppState
  fetchCars: () => Promise<void>
  fetchBookings: () => Promise<void>
  fetchReviews: () => Promise<void>
  addCar: (car: Omit<Car, "id">) => Promise<Car>
  updateCar: (id: string, car: Partial<Car>) => Promise<Car>
  deleteCar: (id: string) => Promise<void>
  addBooking: (booking: Omit<Booking, "id">) => Promise<Booking>
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<Booking>
  deleteBooking: (id: string) => Promise<void>
  addReview: (review: Omit<Review, "id">) => Promise<Review>
  updateReview: (id: string, review: Partial<Review>) => Promise<Review>
  deleteReview: (id: string) => Promise<void>
  getCarById: (id: string) => Car | undefined
  getBookingById: (id: string) => Booking | undefined
  getReviewById: (id: string) => Review | undefined
  getBookingsByCarId: (carId: string) => Booking[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Fetch data on mount
  useEffect(() => {
    // REPLACE THIS: In production, these will make real API calls to your backend
    // If you need to load data differently (e.g., based on user authentication),
    // modify this section accordingly
    fetchCars()
    fetchBookings()
    fetchReviews()
  }, [])

  // Fetch functions
  const fetchCars = async () => {
    dispatch({ type: "FETCH_CARS_START" })
    try {
      // REPLACE THIS: This will make a real API call in production
      // Commenting out the actual API call for now
      // const cars = await carsAPI.getAllCars()
      // dispatch({ type: "FETCH_CARS_SUCCESS", payload: cars })

      // Using mock data directly instead
      console.log("Using mock car data - API integration will be added later")
      const mockCars = [
        {
          id: "1",
          make: "Tesla",
          model: "Model 3",
          year: 2022,
          type: "Sedan",
          seats: 5,
          fuelType: "Electric",
          pricePerDay: 120,
          available: true,
          location: "New York",
          averageRating: 4.9,
          isActive: true,
          description: "The Tesla Model 3 is an electric four-door sedan developed by Tesla.",
          features: ["Autopilot", "Premium Audio System", "Heated Seats"],
          images: ["https://images.unsplash.com/photo-1619767886558-efdc7b9af5a6?q=80&w=2070&auto=format&fit=crop"],
        },
        {
          id: "2",
          make: "BMW",
          model: "X5",
          year: 2021,
          type: "SUV",
          seats: 7,
          fuelType: "Gasoline",
          pricePerDay: 150,
          available: true,
          location: "Los Angeles",
          averageRating: 4.7,
          isActive: true,
          description: "The BMW X5 is a mid-size luxury SUV produced by BMW.",
          features: ["Panoramic Sunroof", "Leather Seats", "Navigation System"],
          images: ["https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2564&auto=format&fit=crop"],
        },
        {
          id: "3",
          make: "Mercedes",
          model: "E-Class",
          year: 2022,
          type: "Sedan",
          seats: 5,
          fuelType: "Hybrid",
          pricePerDay: 180,
          available: false,
          location: "Chicago",
          averageRating: 4.8,
          isActive: true,
          description: "The Mercedes-Benz E-Class is an executive car manufactured by Mercedes-Benz.",
          features: ["Heated Seats", "Premium Sound System", "Driver Assistance Package"],
          images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop"],
        },
      ]
      dispatch({ type: "FETCH_CARS_SUCCESS", payload: mockCars as Car[] })
    } catch (error) {
      dispatch({ type: "FETCH_CARS_ERROR", payload: error as Error })
    }
  }

  const fetchBookings = async () => {
    dispatch({ type: "FETCH_BOOKINGS_START" })
    try {
      // REPLACE THIS: This will make a real API call in production
      // Commenting out the actual API call for now
      // const bookings = await bookingsAPI.getAllBookings()
      // dispatch({ type: "FETCH_BOOKINGS_SUCCESS", payload: bookings })

      // Using mock data directly instead
      console.log("Using mock booking data - API integration will be added later")
      const mockBookings = [
        {
          id: "1",
          renter: {
            id: "u1",
            name: "John Smith",
            email: "john@example.com",
          },
          car: {
            id: "1",
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
            id: "2",
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
            id: "3",
            make: "Mercedes",
            model: "E-Class",
            year: 2022,
            images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop"],
          },
          startDate: new Date("2023-07-05"),
          endDate: new Date("2023-07-10"),
          totalPrice: 900,
          status: "Completed",
          isPaid: true,
          paymentId: "FL-456789123",
          createdAt: new Date("2023-06-15"),
        },
      ]
      dispatch({ type: "FETCH_BOOKINGS_SUCCESS", payload: mockBookings as Booking[] })
    } catch (error) {
      dispatch({ type: "FETCH_BOOKINGS_ERROR", payload: error as Error })
    }
  }

  const fetchReviews = async () => {
    dispatch({ type: "FETCH_REVIEWS_START" })
    try {
      // REPLACE THIS: This will make a real API call in production
      // Commenting out the actual API call for now
      // const reviews = await reviewsAPI.getAllReviews()
      // dispatch({ type: "FETCH_REVIEWS_SUCCESS", payload: reviews })

      // Using mock data directly instead
      console.log("Using mock review data - API integration will be added later")
      const mockReviews = [
        {
          id: "1",
          renter: {
            id: "u1",
            name: "John Smith",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          car: {
            id: "1",
            make: "Tesla",
            model: "Model 3",
          },
          rating: 5,
          comment:
            "Amazing car, very clean and drove perfectly! The agency was very professional and helpful throughout the rental process.",
          isRead: true,
          createdAt: new Date("2023-06-05"),
        },
        {
          id: "2",
          renter: {
            id: "u2",
            name: "Sarah Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          car: {
            id: "2",
            make: "BMW",
            model: "X5",
          },
          rating: 4,
          comment: "Great SUV, perfect for our family trip. The only issue was a small delay during pickup.",
          isRead: false,
          createdAt: new Date("2023-06-08"),
        },
        {
          id: "3",
          renter: {
            id: "u3",
            name: "Michael Brown",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          car: {
            id: "3",
            make: "Mercedes",
            model: "E-Class",
          },
          rating: 5,
          comment:
            "Luxury at its finest. Will rent again! The car was in perfect condition and the agency staff was very friendly.",
          isRead: false,
          createdAt: new Date("2023-06-10"),
        },
      ]
      dispatch({ type: "FETCH_REVIEWS_SUCCESS", payload: mockReviews as Review[] })
    } catch (error) {
      dispatch({ type: "FETCH_REVIEWS_ERROR", payload: error as Error })
    }
  }

  // CRUD operations
  // REPLACE THIS: These functions will make real API calls in production
  const addCar = async (car: Omit<Car, "id">) => {
    try {
      // Comment out the actual API call
      // const newCar = await carsAPI.createCar(car)

      // Create a mock new car with a generated ID
      const newCar = {
        ...car,
        id: `c${Date.now()}`, // Generate a unique ID
      } as Car

      dispatch({ type: "ADD_CAR", payload: newCar })
      return newCar
    } catch (error) {
      console.error("Failed to add car:", error)
      throw error
    }
  }

  const updateCar = async (id: string, car: Partial<Car>) => {
    try {
      // Comment out the actual API call
      // const updatedCar = await carsAPI.updateCar(id, car)

      // Create a mock updated car
      const existingCar = state.cars.find((c) => c.id === id)
      if (!existingCar) {
        throw new Error(`Car with ID ${id} not found`)
      }

      const updatedCar = {
        ...existingCar,
        ...car,
      } as Car

      dispatch({ type: "UPDATE_CAR", payload: updatedCar })
      return updatedCar
    } catch (error) {
      console.error("Failed to update car:", error)
      throw error
    }
  }

  const deleteCar = async (id: string) => {
    try {
      // Comment out the actual API call
      // await carsAPI.deleteCar(id)

      // Just dispatch the delete action
      dispatch({ type: "DELETE_CAR", payload: id })
    } catch (error) {
      console.error("Failed to delete car:", error)
      throw error
    }
  }

  const addBooking = async (booking: Omit<Booking, "id">) => {
    try {
      const newBooking = await bookingsAPI.createBooking(booking)
      dispatch({ type: "ADD_BOOKING", payload: newBooking })
      return newBooking
    } catch (error) {
      console.error("Failed to add booking:", error)
      throw error
    }
  }

  const updateBooking = async (id: string, booking: Partial<Booking>) => {
    try {
      const updatedBooking = await bookingsAPI.updateBooking(id, booking)
      dispatch({ type: "UPDATE_BOOKING", payload: updatedBooking })
      return updatedBooking
    } catch (error) {
      console.error("Failed to update booking:", error)
      throw error
    }
  }

  const deleteBooking = async (id: string) => {
    try {
      await bookingsAPI.deleteBooking(id)
      dispatch({ type: "DELETE_BOOKING", payload: id })
    } catch (error) {
      console.error("Failed to delete booking:", error)
      throw error
    }
  }

  const addReview = async (review: Omit<Review, "id">) => {
    try {
      const newReview = await reviewsAPI.createReview(review)
      dispatch({ type: "ADD_REVIEW", payload: newReview })
      return newReview
    } catch (error) {
      console.error("Failed to add review:", error)
      throw error
    }
  }

  const updateReview = async (id: string, review: Partial<Review>) => {
    try {
      const updatedReview = await reviewsAPI.updateReview(id, review)
      dispatch({ type: "UPDATE_REVIEW", payload: updatedReview })
      return updatedReview
    } catch (error) {
      console.error("Failed to update review:", error)
      throw error
    }
  }

  const deleteReview = async (id: string) => {
    try {
      await reviewsAPI.deleteReview(id)
      dispatch({ type: "DELETE_REVIEW", payload: id })
    } catch (error) {
      console.error("Failed to delete review:", error)
      throw error
    }
  }

  // Helper functions
  const getCarById = (id: string) => {
    return state.cars.find((car) => car.id === id)
  }

  const getBookingById = (id: string) => {
    return state.bookings.find((booking) => booking.id === id)
  }

  const getReviewById = (id: string) => {
    return state.reviews.find((review) => review.id === id)
  }

  const getBookingsByCarId = (carId: string) => {
    return state.bookings.filter((booking) => booking.car.id === carId)
  }

  return (
    <AppContext.Provider
      value={{
        state,
        fetchCars,
        fetchBookings,
        fetchReviews,
        addCar,
        updateCar,
        deleteCar,
        addBooking,
        updateBooking,
        deleteBooking,
        addReview,
        updateReview,
        deleteReview,
        getCarById,
        getBookingById,
        getReviewById,
        getBookingsByCarId,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
