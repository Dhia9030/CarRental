/**
 * API Type Definitions
 *
 * This file contains TypeScript interfaces for all API data structures.
 * These types are used throughout the application to ensure type safety.
 */

/**
 * Car type
 *
 * Represents a car in the rental fleet.
 */
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
  features: string[]
  images: string[]
}

/**
 * Booking type
 *
 * Represents a booking for a car.
 */
export interface Booking {
  id: string
  carId: string
  startDate: string
  endDate: string
  renter: {
    id: string
    name: string
    email: string
  }
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rejected"
  totalPrice: number
  isPaid: boolean
  createdAt: string
}

/**
 * Review type
 *
 * Represents a review for a car.
 */
export interface Review {
  id: string
  carId: string
  renterId: string
  renterName: string
  rating: number
  comment: string
  createdAt: string
}

/**
 * Notification type
 *
 * Represents a notification for the agency.
 */
export interface Notification {
  id: string
  type: "BOOKING" | "REVIEW" | "SYSTEM"
  title: string
  message: string
  isRead: boolean
  createdAt: string
  data?: any // Additional data specific to the notification type
}

/**
 * Chat message type for WebSocket
 *
 * Represents a message in the admin-agency chat.
 */
export interface ChatMessage {
  id: string
  sender: "admin" | "agency"
  content: string
  timestamp: string
}
