# Car Rental Payment System

This payment module provides a comprehensive payment system for the car rental application, built with Stripe integration and supporting the complete rental workflow.

## Features

### 🚗 Complete Car Rental Payment Flow

- **Booking Payment**: Main rental cost based on daily rate and duration
- **Security Deposit**: Refundable deposit (default 20% of booking cost)
- **Damage Fees**: Additional charges for vehicle damage
- **Late Fees**: Charges for late returns
- **Cancellation Fees**: Based on cancellation policy

### 💳 Payment Processing

- **Stripe Integration**: Secure payment processing with Stripe
- **Payment Intents**: Proper 3D Secure and SCA compliance
- **Refunds**: Full and partial refund support
- **Webhooks**: Real-time payment status updates

### 📊 Payment Management

- **Transaction History**: Complete audit trail of all transactions
- **Payment Breakdown**: Detailed cost calculation
- **Invoice Generation**: Professional invoice creation
- **Payment Status Tracking**: Real-time status updates

## Installation

1. Install required dependencies:

```bash
pnpm add stripe @types/stripe
```

2. Add environment variables to your `.env` file:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### Payment Endpoints

#### Process Complete Booking Payment

```http
POST /payment-integration/process-full-payment
Content-Type: application/json

{
  "bookingId": 1,
  "paymentMethodId": "pm_1234567890",
  "customSecurityDepositAmount": 100.00
}
```

#### Get Payment Breakdown

```http
GET /payment-integration/breakdown/1
```

#### Confirm Payment

```http
POST /payments/confirm/pi_1234567890
```

#### Cancel Booking with Refunds

```http
POST /payment-integration/cancel-booking
Content-Type: application/json

{
  "bookingId": 1,
  "cancellationReason": "Customer requested cancellation"
}
```

#### Complete Booking

```http
POST /payment-integration/complete-booking
Content-Type: application/json

{
  "bookingId": 1,
  "damageAssessment": {
    "hasDamage": true,
    "damageAmount": 150.00,
    "damageDescription": "Scratch on rear bumper"
  }
}
```

#### Get Payment History

```http
GET /payment-integration/history/1
```

#### Generate Invoice

```http
GET /payment-integration/invoice/1
```

#### Process Refund

```http
POST /payments/refund
Content-Type: application/json

{
  "paymentId": 1,
  "amount": 50.00,
  "reason": "Partial refund due to early return"
}
```

#### Release Security Deposit

```http
POST /payments/release-deposit/1
Content-Type: application/json

{
  "deductionAmount": 25.00
}
```

## Payment Flow

### 1. Booking Creation

When a user creates a booking:

- Booking is created with `status: 'Pending'`
- Payment breakdown is calculated
- No payment is processed yet

### 2. Payment Processing

When user provides payment method:

```javascript
// Frontend: Get payment breakdown
const breakdown = await fetch("/payment-integration/breakdown/1");

// Frontend: Process payment
const result = await fetch("/payment-integration/process-full-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    bookingId: 1,
    paymentMethodId: "pm_1234567890",
  }),
});

// Frontend: Confirm payment with Stripe
const { clientSecret } = result;
const confirmResult = await stripe.confirmCardPayment(clientSecret);

// Backend: Confirm payment
await fetch(`/payments/confirm/${confirmResult.paymentIntent.id}`, {
  method: "POST",
});
```

### 3. Payment Confirmation

- Payment is confirmed with Stripe
- Booking status changes to `'Confirmed'`
- Payment records are updated
- Transaction history is created

### 4. Booking Completion

- At rental end, complete the booking
- Handle damage assessment
- Release security deposit (minus damages)
- Process additional charges if needed

### 5. Cancellation Handling

- Calculate cancellation fees based on policy
- Process refunds minus fees
- Update booking status

## Cancellation Policy

The system implements a tiered cancellation policy:

- **Same day**: 100% cancellation fee
- **1-3 days before**: 50% cancellation fee
- **3-7 days before**: 25% cancellation fee
- **7+ days before**: 10% cancellation fee

Security deposits are always fully refunded for cancellations.

## Security Features

- **PCI Compliance**: No sensitive card data stored
- **Stripe Elements**: Secure card input handling
- **Webhook Verification**: Cryptographically signed webhooks
- **Amount Validation**: Server-side amount verification
- **Refund Protection**: Controlled refund processing

## Database Schema

### Payment Entity

- `id`: Primary key
- `bookingId`: Foreign key to booking
- `userId`: Foreign key to user
- `amount`: Payment amount
- `refundedAmount`: Total refunded amount
- `currency`: Payment currency (default: USD)
- `status`: Payment status enum
- `type`: Payment type enum
- `stripePaymentIntentId`: Stripe payment intent ID
- `stripeChargeId`: Stripe charge ID
- `description`: Payment description
- `metadata`: JSON metadata
- `processedAt`: Processing timestamp
- `refundedAt`: Refund timestamp
- `failureReason`: Failure reason if applicable

### Transaction Entity

- `id`: Primary key
- `paymentId`: Foreign key to payment
- `amount`: Transaction amount (negative for refunds)
- `currency`: Transaction currency
- `type`: Transaction type enum
- `stripeTransactionId`: Stripe transaction ID
- `status`: Transaction status
- `description`: Transaction description
- `stripeResponse`: Full Stripe response
- `failureReason`: Failure reason if applicable
- `processedAt`: Processing timestamp

## Error Handling

The payment system includes comprehensive error handling:

- **Validation Errors**: Input validation with class-validator
- **Payment Failures**: Stripe error handling and retry logic
- **Business Logic Errors**: Booking status validation
- **Network Errors**: Webhook verification and replay protection

## Testing

### Test with Stripe Test Cards

```javascript
// Successful payment
const card = "4242424242424242";

// Requires authentication (3D Secure)
const card3DS = "4000002500003155";

// Declined card
const cardDeclined = "4000000000000002";
```

### Webhook Testing

Use Stripe CLI to forward webhooks to your local environment:

```bash
stripe listen --forward-to localhost:3000/payments/webhook
```

## Monitoring

The payment system provides comprehensive logging:

- Payment processing events
- Webhook events
- Error tracking
- Transaction audit trails

Monitor these events in your application logs and Stripe dashboard.

## Configuration

### Environment Variables

```bash
# Required
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=car_rental

# JWT
JWT_SECRET=your_jwt_secret
```

### Stripe Dashboard Configuration

1. Create webhook endpoint: `https://your-domain.com/payments/webhook`
2. Subscribe to events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.dispute.created`

## Support

For issues or questions about the payment system:

1. Check Stripe dashboard for payment details
2. Review application logs for error details
3. Verify webhook endpoint configuration
4. Test with Stripe test cards

## Security Considerations

1. **Never log sensitive payment data**
2. **Always verify webhook signatures**
3. **Use HTTPS in production**
4. **Implement proper authentication**
5. **Validate all amounts server-side**
6. **Monitor for suspicious activity**
