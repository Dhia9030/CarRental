# Payment System Usage Examples

## Frontend Integration Example

### 1. Process Complete Booking Payment

```typescript
// Frontend - Payment Component
import { loadStripe } from "@stripe/stripe-js";

const stripe = await loadStripe("pk_test_...");

async function processBookingPayment(
  bookingId: number,
  paymentMethodId: string
) {
  try {
    // 1. Get payment breakdown
    const breakdownResponse = await fetch(
      `/payment-integration/breakdown/${bookingId}`
    );
    const breakdown = await breakdownResponse.json();

    console.log("Payment breakdown:", breakdown);
    // Output: { baseRentalCost: 300, securityDepositAmount: 60, totalAmount: 360, ... }

    // 2. Process payment
    const paymentResponse = await fetch(
      "/payment-integration/process-full-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          paymentMethodId,
          customSecurityDepositAmount: breakdown.securityDepositAmount,
        }),
      }
    );

    const { payment, clientSecret } = await paymentResponse.json();

    // 3. Confirm payment with Stripe
    const confirmResult = await stripe.confirmCardPayment(clientSecret);

    if (confirmResult.error) {
      throw new Error(confirmResult.error.message);
    }

    // 4. Confirm payment on backend
    const confirmResponse = await fetch(
      `/payments/confirm/${confirmResult.paymentIntent.id}`,
      {
        method: "POST",
      }
    );

    const confirmedPayments = await confirmResponse.json();

    console.log("Payment confirmed:", confirmedPayments);
    return confirmedPayments;
  } catch (error) {
    console.error("Payment failed:", error);
    throw error;
  }
}
```

### 2. Handle Booking Cancellation

```typescript
async function cancelBooking(bookingId: number, reason: string) {
  try {
    const response = await fetch("/payment-integration/cancel-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        cancellationReason: reason,
      }),
    });

    const { refunds, cancellationFee } = await response.json();

    console.log("Refunds processed:", refunds);
    if (cancellationFee) {
      console.log("Cancellation fee applied:", cancellationFee);
    }

    return { refunds, cancellationFee };
  } catch (error) {
    console.error("Cancellation failed:", error);
    throw error;
  }
}
```

### 3. Complete Booking with Damage Assessment

```typescript
async function completeBooking(bookingId: number, damageInfo?: any) {
  try {
    const response = await fetch("/payment-integration/complete-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId,
        damageAssessment: damageInfo || { hasDamage: false },
      }),
    });

    const result = await response.json();

    console.log("Booking completed:", result);
    return result;
  } catch (error) {
    console.error("Booking completion failed:", error);
    throw error;
  }
}
```

## Backend Usage Examples

### 1. Custom Payment Processing

```typescript
import { PaymentService } from "../payment/payment.service";
import { PaymentType } from "../payment/enums/payment-status.enum";

@Injectable()
export class CustomPaymentHandler {
  constructor(private paymentService: PaymentService) {}

  async processLateFee(bookingId: number, userId: number, lateDays: number) {
    const lateFeeAmount = lateDays * 25; // $25 per day late

    const payment = await this.paymentService.createPayment({
      bookingId,
      userId,
      amount: lateFeeAmount,
      type: PaymentType.LATE_FEE,
      description: `Late fee for ${lateDays} days overdue`,
      metadata: {
        lateDays,
        ratePerDay: 25,
      },
    });

    return payment;
  }
}
```

### 2. Payment History and Reporting

```typescript
import { PaymentIntegrationService } from "../payment/payment-integration.service";

@Injectable()
export class PaymentReportingService {
  constructor(private paymentIntegration: PaymentIntegrationService) {}

  async generateMonthlyReport(userId: number, month: number, year: number) {
    // Get all user payments for the month
    const payments = await this.paymentIntegration.findByUser(userId);

    const monthlyPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.createdAt);
      return (
        paymentDate.getMonth() === month && paymentDate.getFullYear() === year
      );
    });

    const totalPaid = monthlyPayments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalRefunded = monthlyPayments.reduce(
      (sum, p) => sum + Number(p.refundedAmount || 0),
      0
    );

    return {
      month,
      year,
      totalPaid,
      totalRefunded,
      netAmount: totalPaid - totalRefunded,
      paymentCount: monthlyPayments.length,
    };
  }
}
```

### 3. Webhook Handler Example

```typescript
import { Controller, Post, Headers, Req, RawBodyRequest } from "@nestjs/common";
import { PaymentService } from "../payment/payment.service";

@Controller("webhooks")
export class WebhookController {
  constructor(private paymentService: PaymentService) {}

  @Post("stripe")
  async handleStripeWebhook(
    @Headers("stripe-signature") signature: string,
    @Req() req: RawBodyRequest<Request>
  ) {
    try {
      await this.paymentService.handleStripeWebhook(signature, req.rawBody);
      return { received: true };
    } catch (error) {
      console.error("Webhook error:", error);
      throw error;
    }
  }
}
```

## Environment Configuration

### .env File

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=car_rental

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51234567890abcdef...
STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef...
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret
```

### Production Considerations

```typescript
// main.ts - Configure for webhooks
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Required for Stripe webhooks
  });

  // Configure CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
```

## Testing

### Unit Tests

```typescript
import { Test } from "@nestjs/testing";
import { PaymentService } from "./payment.service";

describe("PaymentService", () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PaymentService,
        // ... mock providers
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it("should calculate payment breakdown correctly", async () => {
    // Test payment calculation logic
  });
});
```

### Integration Tests

```typescript
// Use Stripe test environment
const testBooking = {
  id: 1,
  cost: 300,
  startDate: new Date("2025-06-01"),
  endDate: new Date("2025-06-05"),
  car: { pricePerDay: 75 },
};

// Test with Stripe test cards
const testCards = {
  success: "4242424242424242",
  decline: "4000000000000002",
  require3DS: "4000002500003155",
};
```

This payment system provides a complete solution for car rental payments with proper error handling, security, and integration with Stripe.
