import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { Payment } from "./entities/payment.entity";
import { Transaction } from "./entities/transaction.entity";
import { Booking } from "../booking/entities/booking.entity";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import { UpdatePaymentDto } from "./dtos/update-payment.dto";
import { RefundPaymentDto } from "./dtos/refund-payment.dto";
import { ProcessBookingPaymentDto } from "./dtos/process-booking-payment.dto";
import {
  PaymentStatus,
  PaymentType,
  TransactionType,
} from "./enums/payment-status.enum";
import { BookingStatus } from "../booking/entities/booking.entity";

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly configService: ConfigService
  ) {
    const stripeKey = this.configService.get<string>("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is required");
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: "2025-05-28.basil",
    });
  }

  async processBookingPayment(
    dto: ProcessBookingPaymentDto
  ): Promise<{ payment: Payment; clientSecret: string | null }> {
    // Get booking details
    const booking = await this.bookingRepository.findOne({
      where: { id: dto.bookingId },
      relations: ["car", "user"],
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.status !== BookingStatus.Pending) {
      throw new BadRequestException("Booking is not in pending status");
    }

    // Calculate total payment amount
    const totalDays = this.calculateDays(booking.startDate, booking.endDate);
    const bookingAmount = booking.cost;
    const securityDepositAmount =
      dto.securityDepositAmount || bookingAmount * 0.2; // 20% of booking cost as security deposit
    const totalAmount = bookingAmount + securityDepositAmount;

    try {
      // Create payment intent for the total amount
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: "usd",
        payment_method: dto.paymentMethodId,
        customer: booking.user.email,
        confirmation_method: "manual",
        confirm: false,
        description:
          dto.customDescription ||
          `Car rental payment for booking #${booking.id}`,
        metadata: {
          bookingId: booking.id.toString(),
          userId: booking.user.id.toString(),
          carId: booking.car.id.toString(),
          bookingAmount: bookingAmount.toString(),
          securityDepositAmount: securityDepositAmount.toString(),
          startDate: booking.startDate.toISOString(),
          endDate: booking.endDate.toISOString(),
        },
      });

      // Create booking payment record
      const bookingPayment = await this.createPayment({
        bookingId: booking.id,
        userId: booking.user.id,
        amount: bookingAmount,
        type: PaymentType.BOOKING_PAYMENT,
        description: `Car rental payment for booking #${booking.id}`,
        metadata: {
          totalDays,
          carModel: booking.car.model,
          pricePerDay: booking.car.pricePerDay,
        },
      });

      // Create security deposit record
      const securityPayment = await this.createPayment({
        bookingId: booking.id,
        userId: booking.user.id,
        amount: securityDepositAmount,
        type: PaymentType.SECURITY_DEPOSIT,
        description: `Security deposit for booking #${booking.id}`,
        metadata: {
          percentage: 20,
          baseAmount: bookingAmount,
        },
      });

      // Update payment records with Stripe payment intent ID
      await this.updatePayment(bookingPayment.id, {
        stripePaymentIntentId: paymentIntent.id,
        status: PaymentStatus.PENDING,
      });

      await this.updatePayment(securityPayment.id, {
        stripePaymentIntentId: paymentIntent.id,
        status: PaymentStatus.PENDING,
      });

      return {
        payment: bookingPayment,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Payment processing failed: ${error.message}`
      );
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<Payment[]> {
    try {
      // Confirm the payment intent
      const paymentIntent =
        await this.stripe.paymentIntents.confirm(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        // Find all payments associated with this payment intent
        const payments = await this.paymentRepository.find({
          where: { stripePaymentIntentId: paymentIntentId },
          relations: ["booking"],
        });
        const updatedPayments: Payment[] = [];

        for (const payment of payments) {
          // Update payment status
          await this.updatePayment(payment.id, {
            status: PaymentStatus.COMPLETED,
            stripeChargeId: paymentIntent.latest_charge as string,
          });

          // Create transaction record
          await this.createTransaction({
            paymentId: payment.id,
            amount: payment.amount,
            type: TransactionType.CHARGE,
            stripeTransactionId: paymentIntent.id,
            status: "succeeded",
            description: `Payment confirmed for ${payment.type}`,
            stripeResponse: paymentIntent,
          });

          const updatedPayment = await this.findById(payment.id);
          updatedPayments.push(updatedPayment);
        }

        // Update booking status to confirmed if booking payment is successful
        const bookingPayment = payments.find(
          (p) => p.type === PaymentType.BOOKING_PAYMENT
        );
        if (bookingPayment) {
          await this.bookingRepository.update(bookingPayment.bookingId, {
            status: BookingStatus.Confirmed,
          });
        }

        return updatedPayments;
      } else {
        // Handle failed payment
        const payments = await this.paymentRepository.find({
          where: { stripePaymentIntentId: paymentIntentId },
        });

        for (const payment of payments) {
          await this.updatePayment(payment.id, {
            status: PaymentStatus.FAILED,
            failureReason:
              paymentIntent.last_payment_error?.message || "Payment failed",
          });
        }

        throw new BadRequestException("Payment confirmation failed");
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Payment confirmation failed: ${error.message}`
      );
    }
  }

  async refundPayment(dto: RefundPaymentDto): Promise<Payment> {
    const payment = await this.findById(dto.paymentId);

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException("Can only refund completed payments");
    }

    const refundAmount = dto.amount || payment.amount - payment.refundedAmount;

    if (
      refundAmount <= 0 ||
      refundAmount > payment.amount - payment.refundedAmount
    ) {
      throw new BadRequestException("Invalid refund amount");
    }

    try {
      // Process refund with Stripe
      const refund = await this.stripe.refunds.create({
        charge: payment.stripeChargeId,
        amount: Math.round(refundAmount * 100), // Convert to cents
        reason: "requested_by_customer",
        metadata: {
          paymentId: payment.id.toString(),
          bookingId: payment.bookingId.toString(),
          refundReason: dto.reason || "Customer requested refund",
        },
      });

      // Update payment with refund information
      const newRefundedAmount = payment.refundedAmount + refundAmount;
      const newStatus =
        newRefundedAmount >= payment.amount
          ? PaymentStatus.REFUNDED
          : PaymentStatus.PARTIALLY_REFUNDED;

      await this.updatePayment(payment.id, {
        refundedAmount: newRefundedAmount,
        status: newStatus,
      }); // Create refund transaction record
      await this.createTransaction({
        paymentId: payment.id,
        amount: -refundAmount, // Negative amount for refund
        type: TransactionType.REFUND,
        stripeTransactionId: refund.id,
        status: refund.status || "unknown",
        description: dto.reason || `Refund for ${payment.type}`,
        stripeResponse: refund,
      });

      return await this.findById(payment.id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Refund processing failed: ${error.message}`
      );
    }
  }

  async releaseSecurityDeposit(
    bookingId: number,
    deductionAmount: number = 0
  ): Promise<Payment> {
    const securityPayment = await this.paymentRepository.findOne({
      where: {
        bookingId,
        type: PaymentType.SECURITY_DEPOSIT,
        status: PaymentStatus.COMPLETED,
      },
    });

    if (!securityPayment) {
      throw new NotFoundException("Security deposit not found");
    }

    const refundAmount = securityPayment.amount - deductionAmount;

    if (refundAmount > 0) {
      return await this.refundPayment({
        paymentId: securityPayment.id,
        amount: refundAmount,
        reason:
          deductionAmount > 0
            ? `Security deposit release with ${deductionAmount} deduction`
            : "Security deposit release - no damages",
      });
    } else if (deductionAmount > securityPayment.amount) {
      // Additional charge needed
      const additionalCharge = deductionAmount - securityPayment.amount;

      // Create damage fee payment
      const damagePayment = await this.createPayment({
        bookingId,
        userId: securityPayment.userId,
        amount: additionalCharge,
        type: PaymentType.DAMAGE_FEE,
        description: `Additional damage fee for booking #${bookingId}`,
        metadata: {
          securityDepositUsed: securityPayment.amount,
          additionalChargeRequired: additionalCharge,
        },
      });

      return damagePayment;
    }

    return securityPayment;
  }

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...dto,
      status: PaymentStatus.PENDING,
    });

    return await this.paymentRepository.save(payment);
  }
  async updatePayment(id: number, dto: UpdatePaymentDto): Promise<void> {
    const updateData: any = { ...dto };

    if (dto.status === PaymentStatus.COMPLETED && !dto.processedAt) {
      updateData.processedAt = new Date();
    }

    if (dto.refundedAmount !== undefined && !dto.refundedAt) {
      updateData.refundedAt = new Date();
    }

    await this.paymentRepository.update(id, updateData);
  }

  async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...data,
      processedAt: new Date(),
    });

    return await this.transactionRepository.save(transaction);
  }

  async findById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ["booking", "user", "transactions"],
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    return payment;
  }

  async findByBooking(bookingId: number): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { bookingId },
      relations: ["transactions"],
      order: { createdAt: "DESC" },
    });
  }

  async findByUser(userId: number): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { userId },
      relations: ["booking", "transactions"],
      order: { createdAt: "DESC" },
    });
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ["booking", "user", "transactions"],
      order: { createdAt: "DESC" },
    });
  }

  private calculateDays(startDate: Date, endDate: Date): number {
    const timeDifference = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }
  // Handle Stripe webhooks
  async handleStripeWebhook(signature: string, payload: Buffer): Promise<void> {
    const webhookSecret = this.configService.get<string>(
      "STRIPE_WEBHOOK_SECRET"
    );

    if (!webhookSecret) {
      throw new BadRequestException("Webhook secret not configured");
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentIntentSucceeded(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        case "charge.dispute.created":
          await this.handleChargeDispute(event.data.object as Stripe.Dispute);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      throw new BadRequestException(
        `Webhook signature verification failed: ${error.message}`
      );
    }
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    // This is handled in confirmPayment method
    console.log(`Payment intent ${paymentIntent.id} succeeded`);
  }

  private async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    const payments = await this.paymentRepository.find({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    for (const payment of payments) {
      await this.updatePayment(payment.id, {
        status: PaymentStatus.FAILED,
        failureReason:
          paymentIntent.last_payment_error?.message || "Payment failed",
      });
    }
  }

  private async handleChargeDispute(dispute: Stripe.Dispute): Promise<void> {
    const chargeId = dispute.charge as string;
    const payment = await this.paymentRepository.findOne({
      where: { stripeChargeId: chargeId },
    });

    if (payment) {
      await this.createTransaction({
        paymentId: payment.id,
        amount: -dispute.amount / 100, // Convert from cents and make negative
        type: TransactionType.DISPUTE,
        stripeTransactionId: dispute.id,
        status: dispute.status,
        description: `Dispute created: ${dispute.reason}`,
        stripeResponse: dispute,
      });
    }
  }
}
