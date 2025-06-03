# Postman Testing Guide for Car Rental Payment System (Mock Implementation)

## Overview

This guide provides comprehensive step-by-step instructions for testing the car rental payment system using Postman. The system uses a mock payment implementation with a dual-controller architecture:

- **Payment Integration Controller** (`/payment-integration`): High-level business logic for complete payment workflows
- **Payment Controller** (`/payments`): Low-level payment operations and direct payment management

## Prerequisites

- Server running on `http://localhost:3000`
- Postman installed and configured
- Basic understanding of JWT tokens and REST APIs
- Mock payment system configured (no external payment provider required)

## Payment System Architecture

### Payment Integration Endpoints (`/payment-integration/*`)

- **Breakdown**: Calculate payment breakdown for bookings
- **Process Full Payment**: Handle complete booking payment with security deposit
- **Cancel Booking**: Process refunds with cancellation fees
- **Complete Booking**: Handle booking completion with damage assessment
- **Payment History**: Get comprehensive payment history for bookings
- **Invoice Generation**: Generate detailed invoices

### Direct Payment Endpoints (`/payments/*`)

- **Process Booking**: Low-level payment processing
- **Confirm Payment**: Confirm mock payment intents
- **Refund Operations**: Direct refund processing
- **Security Deposit**: Release security deposits
- **Payment CRUD**: Create, read, update payment records

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

## PHASE 7: Invoice Generation and Advanced Features

### Step 20: Generate Invoice

**Method:** GET  
**URL:** `http://localhost:3000/payment-integration/invoice/1`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Expected Result:**

```json
{
  "invoiceNumber": "INV-1-1748887123456",
  "booking": {
    "id": 1,
    "startDate": "2025-06-10T00:00:00.000Z",
    "endDate": "2025-06-15T00:00:00.000Z",
    "cost": 225.0,
    "status": "Confirmed"
  },
  "breakdown": {
    "baseRentalCost": 225.0,
    "numberOfDays": 5,
    "dailyRate": 45.0,
    "securityDepositRate": 0.2,
    "securityDepositAmount": 45.0,
    "totalAmount": 270.0,
    "taxes": 0,
    "fees": 0
  },
  "payments": [
    {
      "id": 1,
      "amount": 225.0,
      "type": "BOOKING_PAYMENT",
      "status": "COMPLETED"
    },
    {
      "id": 2,
      "amount": 45.0,
      "type": "SECURITY_DEPOSIT",
      "status": "COMPLETED"
    }
  ],
  "totalAmount": 270.0,
  "paidAmount": 270.0,
  "remainingAmount": 0
}
```

### Step 21: Test Mock Webhook

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

### Step 22: Get Individual Payment Details

**Method:** GET  
**URL:** `http://localhost:3000/payments/1`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Expected Result:**

```json
{
  "id": 1,
  "amount": 225.0,
  "type": "BOOKING_PAYMENT",
  "status": "COMPLETED",
  "stripePaymentIntentId": "pi_mock_1748886340166_cyigial45",
  "stripeChargeId": "ch_mock_1748886401234_abcdef",
  "description": "Car rental payment breakdown: Base: $225, Security: $45",
  "metadata": {
    "totalDays": 5,
    "carModel": "Sedan",
    "pricePerDay": 45
  },
  "refundedAmount": 0,
  "createdAt": "2025-01-31T10:00:00.000Z",
  "updatedAt": "2025-01-31T10:05:00.000Z",
  "transactions": [
    {
      "id": 1,
      "amount": 225.0,
      "type": "CHARGE",
      "status": "SUCCEEDED",
      "description": "Payment confirmation"
    }
  ]
}
```

### Step 23: Get Payments by Booking

**Method:** GET  
**URL:** `http://localhost:3000/payments/booking/1`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Expected Result:**

- Array of all payments associated with booking
- Both booking payment and security deposit
- Complete transaction history for each payment

### Step 24: Get User's Payment History

**Method:** GET  
**URL:** `http://localhost:3000/payments/user/2`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Expected Result:**

- All payments for the user across all bookings
- Complete payment and transaction details

### Step 25: Create Manual Payment Entry

**Method:** POST  
**URL:** `http://localhost:3000/payments`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "bookingId": 1,
  "userId": 2,
  "amount": 25.0,
  "type": "DAMAGE_FEE",
  "description": "Additional damage fee",
  "metadata": {
    "source": "manual_entry",
    "reason": "Post-rental inspection"
  }
}
```

**Expected Result:**

- Manual payment record created
- New payment ID returned
- Payment in PENDING status by default

### Step 26: Update Payment Status

**Method:** PUT  
**URL:** `http://localhost:3000/payments/3`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "status": "COMPLETED",
  "metadata": {
    "updated_by": "admin",
    "update_reason": "Manual confirmation"
  }
}
```

**Expected Result:**

- Payment status updated successfully
- Metadata merged with existing data

---

## PHASE 9: Payment Status and Flow Testing

### Step 27: Test Payment Status Endpoint

**⚠️ Note: This endpoint is NOT implemented in the backend**

**Method:** GET  
**URL:** `http://localhost:3000/payment-integration/status/pi_mock_1748886340166_cyigial45`  
**Headers:**

```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Status:** This endpoint will return 404 - Not Found

**Alternative Approaches:**

#### Option A: Use Payment History by Booking

**Method:** GET  
**URL:** `http://localhost:3000/payment-integration/history/1`

#### Option B: Use Direct Payment Details

**Method:** GET  
**URL:** `http://localhost:3000/payments/1`

**Expected Result (if endpoint existed):**

```json
{
  "paymentIntentId": "pi_mock_1748886340166_cyigial45",
  "status": "succeeded",
  "amount": 27000,
  "currency": "usd",
  "payments": [
    {
      "id": 1,
      "amount": 225.0,
      "type": "BOOKING_PAYMENT",
      "status": "COMPLETED"
    },
    {
      "id": 2,
      "amount": 45.0,
      "type": "SECURITY_DEPOSIT",
      "status": "COMPLETED"
    }
  ]
}
```

### Step 28: Test Low-Level Payment Processing

**Method:** POST  
**URL:** `http://localhost:3000/payments/process-booking`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {USER_TOKEN}
```

**Body (JSON):**

```json
{
  "bookingId": 1,
  "paymentMethodId": "pm_card_visa",
  "securityDepositAmount": 50.0,
  "customDescription": "Direct payment processing test"
}
```

**Expected Result:**

- Two payment records created directly
- Mock payment intent generated
- Lower-level payment processing without business logic layer

---

## PHASE 10: Complete Testing Scenarios

### Scenario 1: Full Payment Lifecycle

1. **GET** `/payment-integration/breakdown/1` - Get breakdown
2. **POST** `/payment-integration/process-full-payment` - Process payment
3. **POST** `/payments/confirm/{paymentIntentId}` - Confirm payment
4. **GET** `/payment-integration/history/1` - Verify completion
5. **GET** `/payment-integration/invoice/1` - Generate invoice

### Scenario 2: Cancellation with Refunds

1. **POST** `/payment-integration/process-full-payment` - Process payment
2. **POST** `/payments/confirm/{paymentIntentId}` - Confirm payment
3. **POST** `/payment-integration/cancel-booking` - Cancel with refunds
4. **GET** `/payment-integration/history/1` - Verify refunds

### Scenario 3: Booking Completion with Damage

1. **POST** `/payment-integration/complete-booking` - Complete with damage
2. **GET** `/payment-integration/history/1` - Check damage fees
3. **GET** `/payment-integration/invoice/1` - Generate final invoice

### Scenario 4: Direct Payment Management

1. **POST** `/payments` - Create manual payment
2. **PUT** `/payments/{id}` - Update payment status
3. **POST** `/payments/refund` - Process refund
4. **GET** `/payments/user/{userId}` - Check user history

---

## API Endpoint Reference

### Payment Integration Controller (`/payment-integration`)

| Method | Endpoint                 | Description                              |
| ------ | ------------------------ | ---------------------------------------- |
| GET    | `/breakdown/{bookingId}` | Calculate payment breakdown              |
| POST   | `/process-full-payment`  | Process complete booking payment         |
| POST   | `/cancel-booking`        | Handle booking cancellation with refunds |
| POST   | `/complete-booking`      | Complete booking with damage assessment  |
| GET    | `/history/{bookingId}`   | Get comprehensive payment history        |
| GET    | `/invoice/{bookingId}`   | Generate detailed invoice                |

### Payment Controller (`/payments`)

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| GET    | `/{id}`                        | Get payment by ID               |
| GET    | `/booking/{bookingId}`         | Get payments by booking         |
| GET    | `/user/{userId}`               | Get payments by user            |
| GET    | `/`                            | Get all payments (with filters) |
| POST   | `/process-booking`             | Low-level payment processing    |
| POST   | `/confirm/{paymentIntentId}`   | Confirm payment intent          |
| POST   | `/refund`                      | Process payment refund          |
| POST   | `/release-deposit/{bookingId}` | Release security deposit        |
| POST   | `/`                            | Create payment record           |
| PUT    | `/{id}`                        | Update payment                  |
| POST   | `/webhook`                     | Handle mock webhooks            |

---

## Payment Types and Statuses

### Payment Types

- `BOOKING_PAYMENT` - Main rental payment
- `SECURITY_DEPOSIT` - Security deposit
- `DAMAGE_FEE` - Damage assessment fee
- `CANCELLATION_FEE` - Cancellation penalty
- `REFUND` - Refund payment
- `LATE_FEE` - Late return fee

### Payment Statuses

- `PENDING` - Payment initiated but not confirmed
- `COMPLETED` - Payment successfully processed
- `FAILED` - Payment processing failed
- `CANCELLED` - Payment cancelled
- `PARTIALLY_REFUNDED` - Partial refund processed
- `REFUNDED` - Fully refunded

### Transaction Types

- `CHARGE` - Payment charge
- `REFUND` - Refund transaction
- `DEPOSIT_RELEASE` - Security deposit release
- `FEE` - Additional fee transaction

---

## Mock Payment System Features

### Mock Payment Intent Generation

- Format: `pi_mock_{timestamp}_{randomString}`
- Example: `pi_mock_1748886340166_cyigial45`

### Mock Charge ID Generation

- Format: `ch_mock_{timestamp}_{randomString}`
- Example: `ch_mock_1748886401234_abcdef`

### Mock Refund ID Generation

- Format: `re_mock_{timestamp}_{randomString}`
- Example: `re_mock_1748886501234_ghijkl`

### Cancellation Policy

- **Same day**: 100% fee
- **< 3 days**: 50% fee
- **< 7 days**: 25% fee
- **> 7 days**: 10% fee

### Security Deposit Policy

- **Default**: 20% of booking cost
- **Damage deduction**: Applied directly from deposit
- **Additional charges**: If damage > deposit amount

---

## Important Notes

### Authentication Requirements

- **User Token**: Required for user-related operations
- **Agency Token**: Required for agency operations (if applicable)
- **Token Format**: `Bearer {token}`
- **Token Expiry**: 24 hours

### Data Dependencies

Many endpoints require existing data:

1. Valid user registration
2. Car availability
3. Active booking
4. Completed payments (for refunds)

### Mock System Behavior

- All payments are simulated with console logging
- No external payment providers are contacted
- Mock IDs are generated consistently
- Payment confirmations happen immediately
- Refunds are processed instantly

### Error Handling

Common error scenarios:

- Invalid booking ID (404)
- Payment already confirmed (400)
- Insufficient refund amount (400)
- Missing authentication (401)
- Invalid payment status (400)

### Testing Best Practices

1. **Sequential Testing**: Follow the phases in order
2. **Token Management**: Ensure tokens are valid and current
3. **Data Validation**: Check response structures match expectations
4. **Console Monitoring**: Watch server logs for mock payment details
5. **State Verification**: Use history endpoints to verify state changes
6. **Error Testing**: Test invalid scenarios to verify error handling

### Debugging Tips

- Enable detailed logging in server console
- Use payment history to track state changes
- Verify mock IDs are generated consistently
- Check database state between operations
- Test edge cases like duplicate payments

### Known Limitations

1. **Real Payment Processing**: No actual payment providers integrated
2. **Currency Support**: Currently USD only
3. **Webhook Validation**: Mock webhooks don't validate signatures
4. **Rate Limiting**: No rate limiting implemented
5. **Audit Trail**: Limited audit logging for payment changes
6. **Missing Payment Status Endpoint**: The frontend expects `GET /payment-integration/status/{paymentIntentId}` but this endpoint is not implemented
   - **Workaround**: Use `GET /payment-integration/history/{bookingId}` to get payment status information
   - **Alternative**: Use `GET /payments/{paymentId}` for individual payment details
7. **API Mismatch Issues**: Some frontend API calls don't match backend implementation
   - Invoice generation endpoint expects different parameters
   - Payment status retrieval uses different ID types

This comprehensive guide covers all payment scenarios in the current system architecture. The mock implementation provides full functionality for development and testing purposes while maintaining the same API structure as a production system would have.
