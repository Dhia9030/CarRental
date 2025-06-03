import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { BookingService } from "../booking/booking.service";
import { PaymentType, PaymentStatus } from "./enums/payment-status.enum";
import { BookingStatus } from "../booking/entities/booking.entity";
import { Payment } from "./entities/payment.entity";

export interface CarRentalPaymentSummary {
  bookingId: number;
  totalCost: number;
  securityDeposit: number;
  totalAmount: number;
  payments: {
    bookingPayment: any;
    securityPayment: any;
  };
}

export interface PaymentBreakdown {
  baseRentalCost: number;
  numberOfDays: number;
  dailyRate: number;
  securityDepositRate: number;
  securityDepositAmount: number;
  totalAmount: number;
  taxes?: number;
  fees?: number;
}

@Injectable()
export class PaymentIntegrationService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly bookingService: BookingService
  ) {}

  async calculatePaymentBreakdown(
    bookingId: number
  ): Promise<PaymentBreakdown> {
    const booking = await this.bookingService.findById(bookingId);

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const numberOfDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );

    const baseRentalCost = booking.cost;
    const dailyRate = booking.car.pricePerDay;
    const securityDepositRate = 0.2; // 20%
    const securityDepositAmount = baseRentalCost * securityDepositRate;

    return {
      baseRentalCost,
      numberOfDays,
      dailyRate,
      securityDepositRate,
      securityDepositAmount,
      totalAmount: baseRentalCost + securityDepositAmount,
      taxes: 0, // Can be calculated based on location
      fees: 0, // Additional fees
    };
  }

  async processCompleteBookingPayment(
    bookingId: number,
    paymentMethodId: string,
    customSecurityDepositAmount?: number
  ): Promise<CarRentalPaymentSummary> {
    const breakdown = await this.calculatePaymentBreakdown(bookingId);
    const securityDepositAmount =
      customSecurityDepositAmount || breakdown.securityDepositAmount;

    const result = await this.paymentService.processBookingPayment({
      bookingId,
      paymentMethodId,
      securityDepositAmount,
      customDescription: `Car rental payment breakdown: Base: $${breakdown.baseRentalCost}, Security: $${securityDepositAmount}`,
    });

    const payments = await this.paymentService.findByBooking(bookingId);
    const bookingPayment = payments.find(
      (p) => p.type === PaymentType.BOOKING_PAYMENT
    );
    const securityPayment = payments.find(
      (p) => p.type === PaymentType.SECURITY_DEPOSIT
    );

    return {
      bookingId,
      totalCost: breakdown.baseRentalCost,
      securityDeposit: securityDepositAmount,
      totalAmount: breakdown.baseRentalCost + securityDepositAmount,
      payments: {
        bookingPayment,
        securityPayment,
      },
    };
  }

  async handleBookingCancellation(
    bookingId: number,
    cancellationReason: string = "Customer requested cancellation"
  ): Promise<{ refunds: any[]; cancellationFee?: any }> {
    const booking = await this.bookingService.findById(bookingId);

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    const payments = await this.paymentService.findByBooking(bookingId);
    const completedPayments = payments.filter(
      (p) => p.status === PaymentStatus.COMPLETED
    );

    if (completedPayments.length === 0) {
      throw new BadRequestException(
        "No completed payments found for this booking"
      );
    }

    const startDate = new Date(booking.startDate);
    const currentDate = new Date();
    const daysUntilStart = Math.ceil(
      (startDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
    );

    let cancellationFeeRate = 0;

    // Cancellation policy
    if (daysUntilStart < 1) {
      cancellationFeeRate = 1.0; // 100% fee if same day
    } else if (daysUntilStart < 3) {
      cancellationFeeRate = 0.5; // 50% fee if less than 3 days
    } else if (daysUntilStart < 7) {
      cancellationFeeRate = 0.25; // 25% fee if less than 7 days
    } else {
      cancellationFeeRate = 0.1; // 10% fee if more than 7 days
    }
    const refunds: Payment[] = [];
    let cancellationFee: Payment | null = null;

    for (const payment of completedPayments) {
      if (payment.type === PaymentType.BOOKING_PAYMENT) {
        const cancellationFeeAmount = payment.amount * cancellationFeeRate;
        const refundAmount = payment.amount - cancellationFeeAmount;

        if (cancellationFeeAmount > 0) {
          // Create cancellation fee record
          cancellationFee = await this.paymentService.createPayment({
            bookingId,
            userId: payment.userId,
            amount: cancellationFeeAmount,
            type: PaymentType.CANCELLATION_FEE,
            description: `Cancellation fee (${(cancellationFeeRate * 100).toFixed(0)}%) for booking #${bookingId}`,
            metadata: {
              originalPaymentId: payment.id,
              daysUntilStart,
              cancellationReason,
            },
          });
        }

        if (refundAmount > 0) {
          const refund = await this.paymentService.refundPayment({
            paymentId: payment.id,
            amount: refundAmount,
            reason: `Cancellation refund minus ${(cancellationFeeRate * 100).toFixed(0)}% fee`,
          });
          refunds.push(refund);
        }
      } else if (payment.type === PaymentType.SECURITY_DEPOSIT) {
        // Full refund of security deposit for cancellations
        const refund = await this.paymentService.refundPayment({
          paymentId: payment.id,
          amount: payment.amount,
          reason: "Security deposit refund due to cancellation",
        });
        refunds.push(refund);
      }
    } // Update booking status
    await this.bookingService.updateStatus(bookingId, BookingStatus.Rejected);

    return { refunds, cancellationFee };
  }

  async handleBookingCompletion(
    bookingId: number,
    damageAssessment: {
      hasDamage: boolean;
      damageAmount?: number;
      damageDescription?: string;
    } = { hasDamage: false }
  ): Promise<{ securityDepositRelease?: any; additionalCharge?: any }> {
    const booking = await this.bookingService.findById(bookingId);

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.status !== BookingStatus.Confirmed) {
      throw new BadRequestException("Booking must be confirmed to complete");
    }

    const currentDate = new Date();
    const endDate = new Date(booking.endDate);

    if (currentDate < endDate) {
      throw new BadRequestException("Cannot complete booking before end date");
    }

    const damageAmount = damageAssessment.hasDamage
      ? damageAssessment.damageAmount || 0
      : 0;

    const result = await this.paymentService.releaseSecurityDeposit(
      bookingId,
      damageAmount
    );

    let additionalChargePayment: Payment | null = null;

    if (damageAmount > 0) {
      const securityPayments =
        await this.paymentService.findByBooking(bookingId);
      const securityDeposit = securityPayments.find(
        (p) => p.type === PaymentType.SECURITY_DEPOSIT
      );

      if (securityDeposit && damageAmount > securityDeposit.amount) {
        // Additional charge needed beyond security deposit
        additionalChargePayment = await this.paymentService.createPayment({
          bookingId,
          userId: booking.userId,
          amount: damageAmount - securityDeposit.amount,
          type: PaymentType.DAMAGE_FEE,
          description: `Additional damage fee: ${damageAssessment.damageDescription || "Vehicle damage"}`,
          metadata: {
            totalDamageAmount: damageAmount,
            securityDepositUsed: securityDeposit.amount,
            damageDescription: damageAssessment.damageDescription,
          },
        });
      }
    }

    return {
      securityDepositRelease: result,
      additionalCharge: additionalChargePayment,
    };
  }

  async getPaymentHistory(bookingId: number): Promise<{
    booking: any;
    payments: any[];
    totalPaid: number;
    totalRefunded: number;
    outstandingBalance: number;
  }> {
    const booking = await this.bookingService.findById(bookingId);

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    const payments = await this.paymentService.findByBooking(bookingId);

    const totalPaid = payments
      .filter((p) => p.status === PaymentStatus.COMPLETED)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalRefunded = payments.reduce(
      (sum, p) => sum + Number(p.refundedAmount || 0),
      0
    );

    const outstandingBalance = payments
      .filter((p) => p.status === PaymentStatus.PENDING)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      booking,
      payments,
      totalPaid,
      totalRefunded,
      outstandingBalance,
    };
  }

  async generateInvoice(bookingId: number): Promise<{
    invoiceNumber: string;
    booking: any;
    breakdown: PaymentBreakdown;
    payments: any[];
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
  }> {
    const paymentHistory = await this.getPaymentHistory(bookingId);
    const breakdown = await this.calculatePaymentBreakdown(bookingId);

    const invoiceNumber = `INV-${bookingId}-${Date.now()}`;

    return {
      invoiceNumber,
      booking: paymentHistory.booking,
      breakdown,
      payments: paymentHistory.payments,
      totalAmount: breakdown.totalAmount,
      paidAmount: paymentHistory.totalPaid,
      remainingAmount: paymentHistory.outstandingBalance,
    };
  }
}
