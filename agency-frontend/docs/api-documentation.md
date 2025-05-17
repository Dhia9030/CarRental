# API Documentation for Car Rental Agency Platform

This document outlines all the API endpoints, request/response structures, and implementation details for the car rental agency platform.

## Base URL

All API endpoints are relative to the base URL:

\`\`\`
${process.env.NEXT_PUBLIC_API_URL}
\`\`\`

## Authentication

All API requests should include an authentication token in the header:

\`\`\`
Authorization: Bearer <your_token>
\`\`\`

## API Endpoints

### Cars

#### GET /cars

Retrieves a list of all cars.

**Response Format:**
\`\`\`json
[
  {
    "id": "string",
    "make": "string",
    "model": "string",
    "year": "number",
    "type": "string",
    "seats": "number",
    "fuelType": "string",
    "pricePerDay": "number",
    "available": "boolean",
    "location": "string",
    "description": "string",
    "features": ["string"],
    "images": ["string"]
  }
]
\`\`\`

#### GET /cars/:id

Retrieves details for a specific car.

**Response Format:**
\`\`\`json
{
  "id": "string",
  "make": "string",
  "model": "string",
  "year": "number",
  "type": "string",
  "seats": "number",
  "fuelType": "string",
  "pricePerDay": "number",
  "available": "boolean",
  "location": "string",
  "description": "string",
  "features": ["string"],
  "images": ["string"]
}
\`\`\`

#### POST /cars

Creates a new car.

**Request Body:**
\`\`\`json
{
  "make": "string",
  "model": "string",
  "year": "number",
  "type": "string",
  "seats": "number",
  "fuelType": "string",
  "pricePerDay": "number",
  "available": "boolean",
  "location": "string",
  "description": "string",
  "features": ["string"],
  "images": ["string"]
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "id": "string",
  "make": "string",
  "model": "string",
  "year": "number",
  "type": "string",
  "seats": "number",
  "fuelType": "string",
  "pricePerDay": "number",
  "available": "boolean",
  "location": "string",
  "description": "string",
  "features": ["string"],
  "images": ["string"]
}
\`\`\`

#### PATCH /cars/:id

Updates an existing car.

**Request Body:**
\`\`\`json
{
  "make": "string", // optional
  "model": "string", // optional
  "year": "number", // optional
  "type": "string", // optional
  "seats": "number", // optional
  "fuelType": "string", // optional
  "pricePerDay": "number", // optional
  "available": "boolean", // optional
  "location": "string", // optional
  "description": "string", // optional
  "features": ["string"], // optional
  "images": ["string"] // optional
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "id": "string",
  "make": "string",
  "model": "string",
  "year": "number",
  "type": "string",
  "seats": "number",
  "fuelType": "string",
  "pricePerDay": "number",
  "available": "boolean",
  "location": "string",
  "description": "string",
  "features": ["string"],
  "images": ["string"]
}
\`\`\`

#### DELETE /cars/:id

Deletes a car.

**Response Format:**
\`\`\`json
{
  "success": true
}
\`\`\`

### Bookings

#### GET /bookings

Retrieves a list of all bookings.

**Response Format:**
\`\`\`json
[
  {
    "id": "string",
    "carId": "string",
    "startDate": "string (ISO date)",
    "endDate": "string (ISO date)",
    "renter": {
      "id": "string",
      "name": "string",
      "email": "string"
    },
    "status": "Pending | Confirmed | Completed | Cancelled | Rejected",
    "totalPrice": "number",
    "isPaid": "boolean",
    "createdAt": "string (ISO date)"
  }
]
\`\`\`

#### GET /bookings/:id

Retrieves details for a specific booking.

**Response Format:**
\`\`\`json
{
  "id": "string",
  "carId": "string",
  "startDate": "string (ISO date)",
  "endDate": "string (ISO date)",
  "renter": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "status": "Pending | Confirmed | Completed | Cancelled | Rejected",
  "totalPrice": "number",
  "isPaid": "boolean",
  "createdAt": "string (ISO date)"
}
\`\`\`

#### POST /bookings

Creates a new booking.

**Request Body:**
\`\`\`json
{
  "carId": "string",
  "startDate": "string (ISO date)",
  "endDate": "string (ISO date)",
  "renter": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "totalPrice": "number"
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "id": "string",
  "carId": "string",
  "startDate": "string (ISO date)",
  "endDate": "string (ISO date)",
  "renter": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "status": "Pending",
  "totalPrice": "number",
  "isPaid": "boolean",
  "createdAt": "string (ISO date)"
}
\`\`\`

#### PATCH /bookings/:id

Updates an existing booking.

**Request Body:**
\`\`\`json
{
  "status": "Pending | Confirmed | Completed | Cancelled | Rejected", // optional
  "isPaid": "boolean" // optional
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "id": "string",
  "carId": "string",
  "startDate": "string (ISO date)",
  "endDate": "string (ISO date)",
  "renter": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "status": "Pending | Confirmed | Completed | Cancelled | Rejected",
  "totalPrice": "number",
  "isPaid": "boolean",
  "createdAt": "string (ISO date)"
}
\`\`\`

### Reviews

#### GET /reviews

Retrieves a list of all reviews.

**Response Format:**
\`\`\`json
[
  {
    "id": "string",
    "carId": "string",
    "renterId": "string",
    "renterName": "string",
    "rating": "number",
    "comment": "string",
    "createdAt": "string (ISO date)"
  }
]
\`\`\`

#### GET /reviews/:id

Retrieves details for a specific review.

**Response Format:**
\`\`\`json
{
  "id": "string",
  "carId": "string",
  "renterId": "string",
  "renterName": "string",
  "rating": "number",
  "comment": "string",
  "createdAt": "string (ISO date)"
}
\`\`\`

#### POST /reviews

Creates a new review.

**Request Body:**
\`\`\`json
{
  "carId": "string",
  "renterId": "string",
  "renterName": "string",
  "rating": "number",
  "comment": "string"
}
\`\`\`

**Response Format:**
\`\`\`json
{
  "id": "string",
  "carId": "string",
  "renterId": "string",
  "renterName": "string",
  "rating": "number",
  "comment": "string",
  "createdAt": "string (ISO date)"
}
\`\`\`

### Notifications

#### GET /notifications

Retrieves a list of all notifications.

**Response Format:**
\`\`\`json
[
  {
    "id": "string",
    "type": "BOOKING | REVIEW | SYSTEM",
    "title": "string",
    "message": "string",
    "isRead": "boolean",
    "createdAt": "string (ISO date)",
    "data": "object (optional)"
  }
]
\`\`\`

#### POST /notifications/:id/read

Marks a notification as read.

**Response Format:**
\`\`\`json
{
  "success": true
}
\`\`\`

#### POST /notifications/read-all

Marks all notifications as read.

**Response Format:**
\`\`\`json
{
  "success": true
}
\`\`\`

## Server-Sent Events (SSE)

### GET /notifications/sse

Establishes an SSE connection for real-time notifications.

**Event Format:**
\`\`\`json
{
  "id": "string",
  "type": "BOOKING | REVIEW | SYSTEM",
  "title": "string",
  "message": "string",
  "isRead": false,
  "createdAt": "string (ISO date)",
  "data": "object (optional)"
}
\`\`\`

## WebSocket

### WebSocket Connection: /ws/chat

Establishes a WebSocket connection for real-time chat.

**Message Format (Sent and Received):**
\`\`\`json
{
  "id": "string",
  "sender": "admin | agency",
  "content": "string",
  "timestamp": "string (ISO date)"
}
