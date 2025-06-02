/**
 * API utility functions for client application
 *
 * This file contains all API interaction functions for the client-facing application.
 * It connects to the same backend as the agency frontend but with client-specific endpoints.
 */

import {
  Car,
  Booking,
  Review,
  PaymentData,
  PaymentResponse,
  PaymentStatus,
  SearchFilters,
  User,
  Notification,
  ApiResponse,
  PaginatedResponse,
} from "@/types/api";

// Base URL for API requests - update this to match your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Generic fetch function with error handling and authentication
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    fetchAPI<{ token: string; user: User }>("/auth/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) =>
    fetchAPI<{ token: string; user: User }>("/auth/user/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  forgotPassword: (email: string) =>
    fetchAPI<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    fetchAPI<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),

  verifyToken: () => fetchAPI<{ user: User }>("/auth/verify"),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    return Promise.resolve();
  },
};

// Cars API - for browsing and searching cars
export const carsAPI = {
  getAllCars: (filters?: SearchFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    const queryString = params.toString();
    return fetchAPI<PaginatedResponse<Car>>(
      `/cars${queryString ? `?${queryString}` : ""}`
    );
  },

  getCarById: (id: string) => fetchAPI<Car>(`/cars/${id}`),

  searchCars: (filters: SearchFilters) =>
    fetchAPI<PaginatedResponse<Car>>("/cars/search", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  getAvailableCars: (startDate: string, endDate: string, location?: string) => {
    const params = new URLSearchParams({ startDate, endDate });
    if (location) params.append("location", location);
    return fetchAPI<Car[]>(`/cars/available?${params.toString()}`);
  },

  getCarReviews: (carId: string) =>
    fetchAPI<Review[]>(`/cars/${carId}/reviews`),

  getFeaturedCars: () => fetchAPI<Car[]>("/cars/featured"),
};

// Bookings API - for managing user bookings
export const bookingsAPI = {
  getUserBookings: () => fetchAPI<Booking[]>("/bookings/user/bookings"),

  getBookingById: (id: string) => fetchAPI<Booking>(`/bookings/${id}`),

  createBooking: (bookingData: {
    carId: string;
    startDate: string;
    endDate: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    notes?: string;
  }) =>
    fetchAPI<Booking>("/bookings/add", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  updateBooking: (id: string, updates: Partial<Booking>) =>
    fetchAPI<Booking>(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  cancelBooking: (id: string, reason?: string) =>
    fetchAPI<{ message: string }>(`/bookings/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  getBookingsByDateRange: (startDate: string, endDate: string) => {
    const params = new URLSearchParams({ startDate, endDate });
    return fetchAPI<Booking[]>(
      `/bookings/user/filter/date-range?${params.toString()}`
    );
  },
};

// Reviews API - for creating and managing reviews
export const reviewsAPI = {
  createReview: (reviewData: {
    carId: string;
    bookingId: string;
    rating: number;
    comment: string;
  }) =>
    fetchAPI<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),

  updateReview: (id: string, updates: { rating?: number; comment?: string }) =>
    fetchAPI<Review>(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  deleteReview: (id: string) =>
    fetchAPI<void>(`/reviews/${id}`, {
      method: "DELETE",
    }),

  getUserReviews: () => fetchAPI<Review[]>("/reviews/user"),
};

// Payments API - for processing payments
export const paymentsAPI = {
  processPayment: (paymentData: PaymentData) =>
    fetchAPI<PaymentResponse>("/payment-integration/process-full-payment", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),

  getPaymentStatus: (paymentId: string) =>
    fetchAPI<PaymentStatus>(`/payments/${paymentId}/status`),

  getPaymentHistory: () =>
    fetchAPI<PaymentStatus[]>("/payment-integration/history"),

  getPaymentBreakdown: (bookingId: string) =>
    fetchAPI<{
      baseAmount: number;
      taxes: number;
      fees: number;
      securityDeposit: number;
      total: number;
    }>(`/payment-integration/breakdown/${bookingId}`),
};

// User Profile API
export const userAPI = {
  getProfile: () => fetchAPI<User>("/user/profile"),

  updateProfile: (updates: Partial<User>) =>
    fetchAPI<User>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    fetchAPI<{ message: string }>("/user/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  uploadAvatar: (formData: FormData) =>
    fetchAPI<{ avatarUrl: string }>("/user/avatar", {
      method: "POST",
      body: formData,
    }),

  deleteAccount: () =>
    fetchAPI<{ message: string }>("/user/account", {
      method: "DELETE",
    }),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => fetchAPI<Notification[]>("/notifications"),

  markAsRead: (id: string) =>
    fetchAPI<{ success: boolean }>(`/notifications/${id}/read`, {
      method: "POST",
    }),

  markAllAsRead: () =>
    fetchAPI<{ success: boolean }>("/notifications/read-all", {
      method: "POST",
    }),

  deleteNotification: (id: string) =>
    fetchAPI<void>(`/notifications/${id}`, {
      method: "DELETE",
    }),
};

// Support/Chat API
export const supportAPI = {
  sendMessage: (message: string) =>
    fetchAPI<{ messageId: string }>("/support/message", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  getChatHistory: () => fetchAPI<any[]>("/support/chat/history"),

  createSupportTicket: (
    subject: string,
    description: string,
    priority: "low" | "medium" | "high"
  ) =>
    fetchAPI<{ ticketId: string }>("/support/ticket", {
      method: "POST",
      body: JSON.stringify({ subject, description, priority }),
    }),
};

// Health check
export const healthAPI = {
  check: () => fetchAPI<{ status: string; timestamp: string }>("/health"),
};
