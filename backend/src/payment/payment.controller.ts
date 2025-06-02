import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import { UpdatePaymentDto } from "./dtos/update-payment.dto";
import { RefundPaymentDto } from "./dtos/refund-payment.dto";
import { ProcessBookingPaymentDto } from "./dtos/process-booking-payment.dto";
import { PaymentStatus } from "./enums/payment-status.enum";

@Controller("payments")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get(":id")
  async findById(@Param("id") id: number) {
    return await this.paymentService.findById(+id);
  }

  @Get("booking/:bookingId")
  async findByBooking(@Param("bookingId") bookingId: number) {
    return await this.paymentService.findByBooking(+bookingId);
  }

  @Get("user/:userId")
  async findByUser(@Param("userId") userId: number) {
    return await this.paymentService.findByUser(+userId);
  }

  @Get()
  async findAll(
    @Query("status") status?: PaymentStatus,
    @Query("userId") userId?: number,
    @Query("bookingId") bookingId?: number
  ) {
    if (bookingId) {
      return await this.paymentService.findByBooking(+bookingId);
    }
    if (userId) {
      return await this.paymentService.findByUser(+userId);
    }
    return await this.paymentService.findAll();
  }

  @Post("process-booking")
  async processBookingPayment(@Body() dto: ProcessBookingPaymentDto) {
    return await this.paymentService.processBookingPayment(dto);
  }

  @Post("confirm/:paymentIntentId")
  async confirmPayment(@Param("paymentIntentId") paymentIntentId: string) {
    return await this.paymentService.confirmPayment(paymentIntentId);
  }

  @Post("refund")
  async refundPayment(@Body() dto: RefundPaymentDto) {
    return await this.paymentService.refundPayment(dto);
  }

  @Post("release-deposit/:bookingId")
  async releaseSecurityDeposit(
    @Param("bookingId") bookingId: number,
    @Body() body: { deductionAmount?: number }
  ) {
    return await this.paymentService.releaseSecurityDeposit(
      +bookingId,
      body.deductionAmount || 0
    );
  }

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto) {
    return await this.paymentService.createPayment(dto);
  }

  @Put(":id")
  async updatePayment(@Param("id") id: number, @Body() dto: UpdatePaymentDto) {
    await this.paymentService.updatePayment(+id, dto);
    return { message: "Payment updated successfully" };
  }
  // Mock webhook endpoint for development/testing
  @Post("webhook")
  @HttpCode(HttpStatus.OK)
  async handleMockWebhook(@Body() body: { eventType: string; data: any }) {
    console.log(`🎭 Received mock webhook:`, body);
    await this.paymentService.handleMockWebhook(body.eventType, body.data);
    return { received: true, message: "Mock webhook processed successfully" };
  }
}
