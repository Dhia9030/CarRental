/**
 * API utility functions for fetching data from the backend
 *
 * IMPORTANT: This file contains utility functions for making API requests.
 * Currently using NEXT_PUBLIC_API_URL environment variable which should be set to your API base URL.
 *
 * When implementing with a real API:
 * 1. Set the NEXT_PUBLIC_API_URL in your .env file (e.g., NEXT_PUBLIC_API_URL=https://your-api.com/api)
 * 2. Adjust the endpoint paths to match your actual API routes
 * 3. Update the request/response types to match your API's data structure
 * 4. Add any required authentication headers or tokens
 */

// Define types (replace with actual types or imports)
interface Car {
  id: string
  make: string
  model: string
  year: number
}

interface Booking {
  id: string
  carId: string
  startDate: string
  endDate: string
}

interface Review {
  id: string
  carId: string
  rating: number
  comment: string
}

interface PaymentData {
  amount: number
  currency: string
  token: string
}

interface PaymentResponse {
  id: string
  status: string
}

interface PaymentStatus {
  id: string
  status: string
}

interface RefundResponse {
  id: string
  status: string
}

// Base URL for API requests
// REPLACE THIS: When connecting to your real API, set this environment variable in your .env file
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    // REPLACE THIS: You may need to add authentication headers or tokens here
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        // Add your auth headers here, e.g.:
        // "Authorization": `Bearer ${getToken()}`
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Cars API
// REPLACE THIS: Update these endpoints to match your actual API routes
export const carsAPI = {
  getAllCars: () => fetchAPI<Car[]>("/cars"),
  getCarById: (id: string) => fetchAPI<Car>(`/cars/${id}`),
  createCar: (car: Omit<Car, "id">) =>
    fetchAPI<Car>("/cars", {
      method: "POST",
      body: JSON.stringify(car),
    }),
  updateCar: (id: string, car: Partial<Car>) =>
    fetchAPI<Car>(`/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify(car),
    }),
  deleteCar: (id: string) =>
    fetchAPI<void>(`/cars/${id}`, {
      method: "DELETE",
    }),
}

// Bookings API
// REPLACE THIS: Update these endpoints to match your actual API routes
export const bookingsAPI = {
  getAllBookings: () => fetchAPI<Booking[]>("/bookings"),
  getBookingById: (id: string) => fetchAPI<Booking>(`/bookings/${id}`),
  createBooking: (booking: Omit<Booking, "id">) =>
    fetchAPI<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    }),
  updateBooking: (id: string, booking: Partial<Booking>) =>
    fetchAPI<Booking>(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(booking),
    }),
  deleteBooking: (id: string) =>
    fetchAPI<void>(`/bookings/${id}`, {
      method: "DELETE",
    }),
  getBookingsByCarId: (carId: string) => fetchAPI<Booking[]>(`/bookings/car/${carId}`),
}

// Reviews API
// REPLACE THIS: Update these endpoints to match your actual API routes
export const reviewsAPI = {
  getAllReviews: () => fetchAPI<Review[]>("/reviews"),
  getReviewById: (id: string) => fetchAPI<Review>(`/reviews/${id}`),
  createReview: (review: Omit<Review, "id">) =>
    fetchAPI<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(review),
    }),
  updateReview: (id: string, review: Partial<Review>) =>
    fetchAPI<Review>(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(review),
    }),
  deleteReview: (id: string) =>
    fetchAPI<void>(`/reviews/${id}`, {
      method: "DELETE",
    }),
  getReviewsByCarId: (carId: string) => fetchAPI<Review[]>(`/reviews/car/${carId}`),
}

// Payments API (Flouci integration)
// REPLACE THIS: Update these endpoints to match your actual Flouci API integration
export const paymentsAPI = {
  processPayment: (paymentData: PaymentData) =>
    fetchAPI<PaymentResponse>("/payments/process", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),
  getPaymentStatus: (paymentId: string) => fetchAPI<PaymentStatus>(`/payments/${paymentId}/status`),
  refundPayment: (paymentId: string, amount?: number) =>
    fetchAPI<RefundResponse>(`/payments/${paymentId}/refund`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
}
