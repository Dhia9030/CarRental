// API Types for the client application
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  seats: number;
  fuelType: string;
  pricePerDay: number;
  available: boolean;
  location: string;
  description: string;
  features: string[];
  images: string[];
  company?: string; // Alternative field for make
  agency: {
    id: string;
    name: string;
    companyName?: string; // Alternative field for name
    phone?: string;
    email?: string;
  };
  rating?: number;
  reviews?: Review[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
}

export interface Booking {
  id: string;
  carId: string;
  car?: Car;
  userId: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rejected";
  totalPrice: number;
  isPaid: boolean;
  paymentId?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  carId: string;
  userId: string;
  bookingId: string;
  rating: number;
  comment: string;
  description?: string; // Alternative field for comment
  value?: number; // Alternative field for rating
  createdAt: string;
  car?: Car; // Include car details
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface PaymentData {
  amount: number;
  currency: string;
  paymentMethodId: string;
  bookingId: string;
}

export interface PaymentResponse {
  id: string;
  status: string;
  clientSecret?: string;
  confirmationUrl?: string;
}

export interface PaymentStatus {
  id: string;
  status: "pending" | "processing" | "succeeded" | "failed" | "cancelled";
  amount: number;
  currency: string;
  createdAt: string;
}

export interface SearchFilters {
  location?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  carType?: string;
  seats?: number;
  fuelType?: string;
  features?: string[];
  sortBy?: "price" | "rating" | "year" | "name";
  sortOrder?: "asc" | "desc";
}

export interface Notification {
  id: string;
  type: "BOOKING" | "PAYMENT" | "REVIEW" | "SYSTEM";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: "user" | "agency" | "admin";
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  cars?: T[]; // For backward compatibility with cars API
  total?: number; // For backward compatibility
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
