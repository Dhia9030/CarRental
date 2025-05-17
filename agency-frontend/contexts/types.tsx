/**
 * Type definitions for the application
 *
 * IMPORTANT: These types define the data structure used throughout the application.
 *
 * When implementing with a real API:
 * 1. Update these types to match your actual API response structures
 * 2. Add any additional fields that your API returns
 * 3. Adjust the type constraints (like string unions for status) to match your API
 */

// Car type
// REPLACE THIS: Update to match your actual car data structure from the API
export interface Car {
  id: string
  make: string
  model: string
  year: number
  type: string
  seats: number
  fuelType: string
  pricePerDay: number
  available: boolean
  location: string
  description: string
  averageRating: number
  isActive: boolean
  features: string[]
  images: string[]
  bookingDates?: BookingDate[]
}

// Booking type
// REPLACE THIS: Update to match your actual booking data structure from the API
export interface Booking {
  id: string
  renter: {
    id: string
    name: string
    email: string
    phone?: string
  }
  car: {
    id: string
    make: string
    model: string
    year: number
    images: string[]
  }
  startDate: Date
  endDate: Date
  totalPrice: number
  status: "Pending" | "Confirmed" | "Completed" | "Rejected" | "Cancelled"
  isPaid: boolean
  paymentMethod?: string
  paymentId?: string
  createdAt: Date
  notes?: string
}

// Review type
// REPLACE THIS: Update to match your actual review data structure from the API
export interface Review {
  id: string
  renter: {
    id: string
    name: string
    avatar?: string
  }
  car?: {
    id: string
    make: string
    model: string
  }
  agency?: {
    id: string
    companyName: string
  }
  rating: number
  comment: string
  isRead: boolean
  createdAt: Date
}

// Payment types
// REPLACE THIS: Update to match your actual Flouci payment API data structure
export interface PaymentData {
  amount: number
  carId: string
  startDate: Date
  endDate: Date
  renter: {
    name: string
    email: string
    phone?: string
  }
}

export interface PaymentResponse {
  success: boolean
  paymentId: string
  status: "completed" | "pending" | "failed"
  message?: string
}

export interface PaymentStatus {
  paymentId: string
  status: "completed" | "pending" | "failed" | "refunded"
  amount: number
  createdAt: Date
  updatedAt: Date
}

export interface RefundResponse {
  success: boolean
  refundId: string
  originalPaymentId: string
  amount: number
  message?: string
}

// Booking date range
export interface BookingDate {
  start: Date
  end: Date
  bookingId?: string
  renterName?: string
  status?: string
}

// Context state types
export interface AppState {
  cars: Car[]
  bookings: Booking[]
  reviews: Review[]
  loading: {
    cars: boolean
    bookings: boolean
    reviews: boolean
  }
  error: {
    cars: Error | null
    bookings: Error | null
    reviews: Error | null
  }
}
