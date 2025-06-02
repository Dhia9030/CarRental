# Postman Testing Guide for Car Rental Payment System (Mock Implementation)

## Overview

This guide provides step-by-step instructions for testing the car rental payment system using Postman. The system has been converted from Stripe to a mock payment implementation for university project purposes.

## Prerequisites

- Server running on `http://localhost:3000`
- Postman installed and configured
- Basic understanding of JWT tokens and REST APIs

---

## PHASE 1: Setup and Authentication

### Step 1: Register Test User

**Method:** POST  
**URL:** `http://localhost:3000/auth/UserRegister`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Expected Result:** User created with ID (e.g., 2)

### Step 2: Register Test Agency

**Method:** POST  
**URL:** `http://localhost:3000/auth/AgencyRegister`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "agency@example.com",
  "password": "password123",
  "username": "TestAgency"
}
```

**Expected Result:** Agency created with ID (e.g., 1)

### Step 3: Login User and Get Token

**Method:** POST  
**URL:** `http://localhost:3000/auth/UserLogin`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Expected Result:** JWT token for user authentication  
**Action:** Save the `access_token` from response for future requests

### Step 4: Login Agency and Get Token

**Method:** POST  
**URL:** `http://localhost:3000/auth/AgencyLogin`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "agency@example.com",
  "password": "password123"
}
```

**Expected Result:** JWT token for agency authentication  
**Action:** Save the `access_token` from response for future requests

### Step 5: Create Test Car

**Method:** POST  
**URL:** `http://localhost:3000/cars`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {AGENCY_TOKEN}
```

**Body (JSON):**

```json
{
  "model": "Camry",
  "company": "Toyota",
  "year": 2023,
  "pricePerDay": 45.0,
  "fuelType": "gasoline",
  "description": "Comfortable and reliable Toyota Camry for city driving",
  "location": "Test City Downtown",
  "seat": 5
}
```

**Expected Result:** Car created with ID (e.g., 1)

### Step 6: Create Test Booking

**Method:** POST  
**URL:** `http://localhost:3000/bookings/add`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "carId": 1,
  "startDate": "2025-06-10",
  "endDate": "2025-06-15"
}
```

**Expected Result:** Booking created with ID (e.g., 1)

---

## PHASE 2: Payment Breakdown and Processing

### Step 7: Get Payment Breakdown

**Method:** GET  
**URL:** `http://localhost:3000/payment-integration/breakdown/1`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Expected Result:**

```json
{
  "baseRentalCost": 225.0,
  "numberOfDays": 5,
  "dailyRate": 45.0,
  "securityDepositRate": 0.2,
  "securityDepositAmount": 45.0,
  "totalAmount": 270.0,
  "taxes": 0,
  "fees": 0.45
}
```

### Step 8: Process Full Booking Payment

**Method:** POST  
**URL:** `http://localhost:3000/payment-integration/process-full-payment`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "bookingId": 1,
  "paymentMethodId": "pm_mock_test_123"
}
```

**Expected Result:**

- Two payments created: booking payment ($225) and security deposit ($45)
- Mock payment intent ID generated
- Both payments in PENDING status
- Console logs showing mock payment processing

### Step 9: Get Payment History

**Method:** GET  
**URL:** `http://localhost:3000/payment-integration/history/1`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Expected Result:**

- List of all payments for booking
- Shows PENDING status for both payments
- Payment and transaction details

---

## PHASE 3: Payment Confirmation

### Step 10: Confirm Payment

**Method:** POST  
**URL:** `http://localhost:3000/payments/confirm/{PAYMENT_INTENT_ID}`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Note:** Replace `{PAYMENT_INTENT_ID}` with the actual payment intent ID from Step 8 (e.g., `pi_mock_1748886340166_cyigial45`)

**Expected Result:**

- Both payments updated to COMPLETED status
- Mock charge ID generated
- Transaction records created
- Console logs showing confirmation details

### Step 11: Verify Payment Status

**Method:** GET  
**URL:** `http://localhost:3000/payment-integration/history/1`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Expected Result:**

- Both payments show COMPLETED status
- Transaction records visible
- Mock charge IDs present

---

## PHASE 4: Refund Testing

### Step 12: Test Partial Refund

**Method:** POST  
**URL:** `http://localhost:3000/payments/refund`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "paymentId": 1,
  "amount": 50.0,
  "reason": "Partial refund for testing purposes"
}
```

**Expected Result:**

- Payment status changed to PARTIALLY_REFUNDED
- Refund transaction created with negative amount
- Mock refund ID generated
- Console logs showing refund processing
- **Note:** There's currently a known issue with refunded amount calculation showing as "0.01" instead of "50.00"

### Step 13: Test Another Partial Refund

**Method:** POST  
**URL:** `http://localhost:3000/payments/refund`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "paymentId": 1,
  "amount": 25.0,
  "reason": "Second partial refund test"
}
```

**Expected Result:**

- Additional refund processed
- Refund validation allows refunds from PARTIALLY_REFUNDED payments

### Step 14: Test Full Refund (Remaining Amount)

**Method:** POST  
**URL:** `http://localhost:3000/payments/refund`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "paymentId": 1,
  "reason": "Full refund of remaining amount"
}
```

**Note:** No amount specified = refund remaining amount

**Expected Result:**

- Payment status changed to REFUNDED
- Full remaining amount refunded

---

## PHASE 5: Security Deposit Management

### Step 15: Test Security Deposit Release (No Deduction)

**Method:** POST  
**URL:** `http://localhost:3000/payments/release-deposit/1`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "deductionAmount": 0
}
```

**Expected Result:**

- Security deposit fully refunded
- Payment status updated accordingly

### Step 16: Test Security Deposit Release (With Deduction)

**Note:** Create new test data first or use a different security deposit

**Method:** POST  
**URL:** `http://localhost:3000/payments/release-deposit/1`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "deductionAmount": 15.0
}
```

**Expected Result:**

- Partial refund of security deposit (deposit amount - deduction)
- Damage fee record created if deduction > deposit

---

## PHASE 6: Advanced Payment Scenarios

### Step 17: Test Booking Cancellation

**Method:** POST  
**URL:** `http://localhost:3000/payment-integration/cancel-booking`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "bookingId": 1,
  "cancellationReason": "Customer changed plans"
}
```

**Expected Result:**

- Automatic refunds based on cancellation policy
- Cancellation fees applied based on timing
- Security deposit fully refunded
- Booking status updated to Rejected

### Step 18: Test Booking Completion (No Damage)

**Method:** POST  
**URL:** `http://localhost:3000/payment-integration/complete-booking`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "bookingId": 1,
  "damageAssessment": {
    "hasDamage": false
  }
}
```

**Expected Result:**

- Security deposit fully released
- Booking marked as completed

### Step 19: Test Booking Completion (With Damage)

**Method:** POST  
**URL:** `http://localhost:3000/payment-integration/complete-booking`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "bookingId": 1,
  "damageAssessment": {
    "hasDamage": true,
    "damageAmount": 30.0,
    "damageDescription": "Scratch on rear bumper"
  }
}
```

**Expected Result:**

- Security deposit deducted for damage
- Additional charge if damage > deposit
- Partial or no refund of security deposit

---

## PHASE 7: Mock Webhook Testing

### Step 20: Test Mock Webhook

**Method:** POST  
**URL:** `http://localhost:3000/payments/webhook`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "eventType": "payment_intent.succeeded",
  "data": {
    "id": "pi_mock_test_webhook_123",
    "amount": 22500,
    "status": "succeeded"
  }
}
```

**Expected Result:**

- Webhook processed successfully
- Console logs showing webhook handling

---

## PHASE 8: Direct Payment Operations

### Step 21: Get Individual Payment Details

**Method:** GET  
**URL:** `http://localhost:3000/payments/1`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Expected Result:**

- Detailed payment information
- Transaction history
- Current status and amounts

### Step 22: Get Payments by Booking

**Method:** GET  
**URL:** `http://localhost:3000/payments/booking/1`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Expected Result:**

- All payments associated with booking

### Step 23: Get User's Payment History

**Method:** GET  
**URL:** `http://localhost:3000/payments/user/2`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Expected Result:**

- All payments for the user

---

## Important Notes

### Authentication

- Always include the correct JWT token in the Authorization header
- Use user token for user operations, agency token for agency operations
- Tokens expire after 24 hours

### Mock Payment System Features

- All payment processing is simulated with console logging
- Mock IDs are generated for payment intents, charges, and refunds
- No real money is processed
- All Stripe functionality replaced with mock implementations

### Known Issues

1. **Refunded Amount Calculation:** There's currently an issue where refunded amounts show as "0.01" instead of the actual refund amount in the database. The transaction records show correct amounts.

### Debug Information

- All payment operations include detailed console logging
- Check the server console for mock payment processing details
- Debug logs show calculation steps and data flow

### Testing Tips

1. Always verify authentication tokens are valid
2. Check server console for detailed operation logs
3. Use the payment history endpoint to verify state changes
4. Test edge cases like partial refunds and cancellations
5. Verify that payment statuses transition correctly

### Environment

- Development server: `http://localhost:3000`
- Database: Local SQLite/PostgreSQL (check server configuration)
- All operations are logged to console for debugging

This guide provides comprehensive coverage of all payment scenarios in the mock system. Each request should be tested in order, as some requests depend on data created in previous steps.
