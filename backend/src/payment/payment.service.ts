import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
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
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly configService: ConfigService
  ) {}

  // Mock payment intent generator
  private generateMockPaymentIntentId(): string {
    return `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Mock charge ID generator
  private generateMockChargeId(): string {
    return `ch_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Mock refund ID generator
  private generateMockRefundId(): string {
    return `re_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      // Create mock payment intent for the total amount
      const mockPaymentIntentId = this.generateMockPaymentIntentId();
      const mockClientSecret = `${mockPaymentIntentId}_secret_mock`;

      console.log(`🎭 MOCK PAYMENT PROCESSING:
        📋 Booking ID: ${booking.id}
        💰 Booking Amount: $${bookingAmount}
        🔒 Security Deposit: $${securityDepositAmount}
        💳 Total Amount: $${totalAmount}
        📅 Duration: ${totalDays} days
        🚗 Car: ${booking.car.model}
        👤 Customer: ${booking.user.email}
        🆔 Mock Payment Intent: ${mockPaymentIntentId}
      `);

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

      // Update payment records with mock payment intent ID
      await this.updatePayment(bookingPayment.id, {
        stripePaymentIntentId: mockPaymentIntentId,
        status: PaymentStatus.PENDING,
      });

      await this.updatePayment(securityPayment.id, {
        stripePaymentIntentId: mockPaymentIntentId,
        status: PaymentStatus.PENDING,
      });

      return {
        payment: bookingPayment,
        clientSecret: mockClientSecret,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Payment processing failed: ${error.message}`
      );
    }
  }
  async confirmPayment(paymentIntentId: string): Promise<Payment[]> {
    try {
      // Mock payment confirmation - simulate successful payment
      const mockChargeId = this.generateMockChargeId();

      console.log(`🎭 MOCK PAYMENT CONFIRMATION:
        🆔 Payment Intent: ${paymentIntentId}
        ✅ Status: SUCCEEDED
        💳 Mock Charge ID: ${mockChargeId}
      `);

      // Find all payments associated with this payment intent
      const payments = await this.paymentRepository.find({
        where: { stripePaymentIntentId: paymentIntentId },
        relations: ["booking"],
      });

      if (payments.length === 0) {
        throw new NotFoundException(
          "No payments found for this payment intent"
        );
      }

      const updatedPayments: Payment[] = [];

      for (const payment of payments) {
        // Update payment status
        await this.updatePayment(payment.id, {
          status: PaymentStatus.COMPLETED,
          stripeChargeId: mockChargeId,
        });

        // Create transaction record
        await this.createTransaction({
          paymentId: payment.id,
          amount: payment.amount,
          type: TransactionType.CHARGE,
          stripeTransactionId: paymentIntentId,
          status: "succeeded",
          description: `Payment confirmed for ${payment.type}`,
          stripeResponse: {
            id: paymentIntentId,
            amount: payment.amount * 100, // Convert to cents for mock
            status: "succeeded",
            mock: true,
          },
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

        console.log(`✅ BOOKING CONFIRMED:
          📋 Booking ID: ${bookingPayment.bookingId}
          💰 Amount Paid: $${bookingPayment.amount}
          🎉 Status: Confirmed
        `);
      }

      return updatedPayments;
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
    }    if (payment.status !== PaymentStatus.COMPLETED && payment.status !== PaymentStatus.PARTIALLY_REFUNDED) {
      throw new BadRequestException("Can only refund completed or partially refunded payments");
    }

    const refundAmount = dto.amount || payment.amount - payment.refundedAmount;

    if (
      refundAmount <= 0 ||
      refundAmount > payment.amount - payment.refundedAmount
    ) {
      throw new BadRequestException("Invalid refund amount");
    }

    try {
      // Mock refund processing
      const mockRefundId = this.generateMockRefundId();

      console.log(`🎭 MOCK REFUND PROCESSING:
        💳 Payment ID: ${payment.id}
        💰 Refund Amount: $${refundAmount}
        📝 Reason: ${dto.reason || "Customer requested refund"}
        🆔 Mock Refund ID: ${mockRefundId}
        ✅ Status: SUCCEEDED
      `);      // Update payment with refund information
      const newRefundedAmount = payment.refundedAmount + refundAmount;
      const newStatus =
        newRefundedAmount >= payment.amount
          ? PaymentStatus.REFUNDED
          : PaymentStatus.PARTIALLY_REFUNDED;

      console.log(`🔍 REFUND CALCULATION DEBUG:
        💰 Original refunded amount: ${payment.refundedAmount}
        💰 Refund amount being added: ${refundAmount}
        💰 New refunded amount calculated: ${newRefundedAmount}
        📊 Payment amount: ${payment.amount}
        🎯 New status: ${newStatus}
      `);

      await this.updatePayment(payment.id, {
        refundedAmount: newRefundedAmount,
        status: newStatus,
      });

      // Create refund transaction record
      await this.createTransaction({
        paymentId: payment.id,
        amount: -refundAmount, // Negative amount for refund
        type: TransactionType.REFUND,
        stripeTransactionId: mockRefundId,
        status: "succeeded",
        description: dto.reason || `Refund for ${payment.type}`,
        stripeResponse: {
          id: mockRefundId,
          amount: refundAmount * 100, // Convert to cents for mock
          status: "succeeded",
          mock: true,
        },
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
  }  async updatePayment(id: number, dto: UpdatePaymentDto): Promise<void> {
    const updateData: any = { ...dto };

    console.log(`🔍 UPDATE PAYMENT DEBUG:
      📊 Payment ID: ${id}
      💰 DTO received: ${JSON.stringify(dto, null, 2)}
      📝 Update data before processing: ${JSON.stringify(updateData, null, 2)}
    `);

    if (dto.status === PaymentStatus.COMPLETED && !dto.processedAt) {
      updateData.processedAt = new Date();
    }

    if (dto.refundedAmount !== undefined && !dto.refundedAt) {
      updateData.refundedAt = new Date();
    }

    console.log(`🔍 UPDATE PAYMENT FINAL:
      📝 Final update data: ${JSON.stringify(updateData, null, 2)}
    `);

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
  private calculateDays(
    startDate: Date | string,
    endDate: Date | string
  ): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  } // Mock webhook handling for development/testing
  async handleMockWebhook(eventType: string, data: any): Promise<void> {
    console.log(`🎭 MOCK WEBHOOK RECEIVED:
      📨 Event Type: ${eventType}
      📊 Data: ${JSON.stringify(data, null, 2)}
    `);

    switch (eventType) {
      case "payment_intent.succeeded":
        console.log(`✅ Mock payment intent ${data.id} succeeded`);
        break;
      case "payment_intent.payment_failed":
        console.log(`❌ Mock payment intent ${data.id} failed`);
        break;
      case "charge.dispute.created":
        console.log(`⚠️ Mock dispute created for charge ${data.charge}`);
        break;
      default:
        console.log(`📝 Unhandled mock event type: ${eventType}`);
    }
  }
}
