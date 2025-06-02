# Payment Module Testing Guide for Postman

## Prerequisites
1. **Start the Application**: Make sure your NestJS app is running on `http://localhost:3000`
2. **Database Setup**: Ensure you have a MySQL database running with the car rental schema
3. **Environment Variables**: Set up your `.env` file with proper database and Stripe credentials

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require JWT authentication. First, you'll need to:
1. Register/Login as a user to get a JWT token
2. Add the token to Authorization header: `Bearer <your_jwt_token>`

---

## 1. Setup Test Data

### 1.1 Create a User
**POST** `http://localhost:3000/auth/register`
```json
{
  "email": "testuser@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 1.2 Login to Get JWT Token
**POST** `http://localhost:3000/auth/login`
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```
*Save the `access_token` from the response - you'll need it for subsequent requests*

### 1.3 Create an Agency (for car ownership)
**POST** `http://localhost:3000/auth/agency/register`
```json
{
  "email": "agency@example.com",
  "password": "password123",
  "username": "testAgency"
}
```

### 1.4 Create a Car
**POST** `http://localhost:3000/cars/add`
**Headers**: `Authorization: Bearer <your_jwt_token>`
```json
{
  "model": "Toyota Camry",
  "company": "Toyota",
  "year": 2023,
  "pricePerDay": 50.00,
  "fuelType": "gasoline",
  "description": "Reliable sedan for city driving",
  "location": "Downtown",
  "seat": 5
}
```

### 1.5 Create a Booking
**POST** `http://localhost:3000/bookings/add`
**Headers**: `Authorization: Bearer <your_jwt_token>`
```json
{
  "carId": 1,
  "startDate": "2025-06-15",
  "endDate": "2025-06-20",
  "cost": 250.00
}
```

---

## 2. Payment Integration Endpoints

### 2.1 Get Payment Breakdown
**GET** `http://localhost:3000/payment-integration/breakdown/1`

**Expected Response:**
```json
{
  "baseRentalCost": 250.00,
  "numberOfDays": 5,
  "dailyRate": 50.00,
  "securityDepositRate": 0.2,
  "securityDepositAmount": 50.00,
  "totalAmount": 300.00,
  "taxes": 0,
  "fees": 0
}
```

### 2.2 Process Complete Booking Payment
**POST** `http://localhost:3000/payment-integration/process-full-payment`
```json
{
  "bookingId": 1,
  "paymentMethodId": "pm_card_visa",
  "customSecurityDepositAmount": 60.00
}
```

**Expected Response:**
```json
{
  "bookingId": 1,
  "totalCost": 250.00,
  "securityDeposit": 60.00,
  "totalAmount": 310.00,
  "payments": {
    "bookingPayment": {...},
    "securityPayment": {...}
  }
}
```

### 2.3 Get Payment History
**GET** `http://localhost:3000/payment-integration/history/1`

**Expected Response:**
```json
{
  "booking": {...},
  "payments": [...],
  "totalPaid": 310.00,
  "totalRefunded": 0,
  "outstandingBalance": 0
}
```

### 2.4 Cancel Booking with Refunds
**POST** `http://localhost:3000/payment-integration/cancel-booking`
```json
{
  "bookingId": 1,
  "cancellationReason": "Customer requested cancellation"
}
```

**Expected Response:**
```json
{
  "refunds": [...],
  "cancellationFee": {...}
}
```

### 2.5 Complete Booking (with damage assessment)
**POST** `http://localhost:3000/payment-integration/complete-booking`
```json
{
  "bookingId": 1,
  "damageAssessment": {
    "hasDamage": true,
    "damageAmount": 150.00,
    "damageDescription": "Scratch on rear bumper"
  }
}
```

### 2.6 Generate Invoice
**GET** `http://localhost:3000/payment-integration/invoice/1`

---

## 3. Core Payment Endpoints

### 3.1 Process Booking Payment (Low-level)
**POST** `http://localhost:3000/payments/process-booking`
```json
{
  "bookingId": 1,
  "paymentMethodId": "pm_card_visa",
  "securityDepositAmount": 50.00,
  "customDescription": "Car rental payment for booking #1"
}
```

### 3.2 Confirm Payment
**POST** `http://localhost:3000/payments/confirm/pi_1234567890`

### 3.3 Process Refund
**POST** `http://localhost:3000/payments/refund`
```json
{
  "paymentId": 1,
  "amount": 50.00,
  "reason": "Partial refund due to early return"
}
```

### 3.4 Release Security Deposit
**POST** `http://localhost:3000/payments/release-deposit/1`
```json
{
  "deductionAmount": 25.00
}
```

### 3.5 Create Payment (Manual)
**POST** `http://localhost:3000/payments`
```json
{
  "bookingId": 1,
  "userId": 1,
  "amount": 100.00,
  "type": "BOOKING_PAYMENT",
  "description": "Manual payment entry",
  "metadata": {
    "source": "manual_entry"
  }
}
```

### 3.6 Get Payment by ID
**GET** `http://localhost:3000/payments/1`

### 3.7 Get Payments by Booking
**GET** `http://localhost:3000/payments/booking/1`

### 3.8 Get Payments by User
**GET** `http://localhost:3000/payments/user/1`

### 3.9 Update Payment
**PUT** `http://localhost:3000/payments/1`
```json
{
  "status": "COMPLETED",
  "metadata": {
    "updated_by": "admin"
  }
}
```

---

## 4. Testing Workflow

### Scenario 1: Complete Payment Flow
1. Create booking → GET breakdown → Process payment → Confirm payment → Check history
2. **GET** `/payment-integration/breakdown/1`
3. **POST** `/payment-integration/process-full-payment`
4. **POST** `/payments/confirm/{paymentIntentId}`
5. **GET** `/payment-integration/history/1`

### Scenario 2: Cancellation Flow
1. Create booking → Process payment → Cancel booking → Check refunds
2. **POST** `/payment-integration/process-full-payment`
3. **POST** `/payment-integration/cancel-booking`
4. **GET** `/payment-integration/history/1`

### Scenario 3: Completion with Damage
1. Complete booking → Process damage → Check deposit release
2. **POST** `/payment-integration/complete-booking`
3. **GET** `/payment-integration/invoice/1`

---

## 5. Test Payment Methods

For testing with Stripe, use these test payment method IDs:

- **Visa**: `pm_card_visa`
- **Visa Debit**: `pm_card_visa_debit`
- **Mastercard**: `pm_card_mastercard`
- **American Express**: `pm_card_amex`
- **Declined Card**: `pm_card_visa_declined`

---

## 6. Expected Error Responses

### 404 - Booking Not Found
```json
{
  "statusCode": 404,
  "message": "Booking not found",
  "error": "Not Found"
}
```

### 400 - Invalid Payment Data
```json
{
  "statusCode": 400,
  "message": "Booking is not in pending status",
  "error": "Bad Request"
}
```

### 500 - Payment Processing Error
```json
{
  "statusCode": 500,
  "message": "Payment processing failed: [Stripe error message]",
  "error": "Internal Server Error"
}
```

---

## 7. Postman Collection Setup

1. Create a new Postman Collection called "Car Rental Payment API"
2. Add environment variables:
   - `base_url`: `http://localhost:3000`
   - `jwt_token`: (set after login)
   - `booking_id`: (set after creating booking)
3. Add pre-request scripts to automatically set authorization headers
4. Use Postman Tests to validate response structure and status codes

## 8. Important Notes

- Ensure your `.env` file has valid Stripe test keys
- Database must be running and properly configured
- JWT tokens expire - refresh as needed
- Payment amounts are in dollars (Stripe uses cents internally)
- Security deposits are typically 20% of booking cost
- Cancellation fees vary based on timing (same day: 100%, 1-3 days: 50%, etc.)
