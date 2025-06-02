import { Controller, Post, Get, Put, Param, Body, Query } from "@nestjs/common";
import { PaymentIntegrationService } from "./payment-integration.service";

export class ProcessFullBookingPaymentDto {
  bookingId: number;
  paymentMethodId: string;
  customSecurityDepositAmount?: number;
}

export class CancelBookingDto {
  bookingId: number;
  cancellationReason?: string;
}

export class CompleteBookingDto {
  bookingId: number;
  damageAssessment?: {
    hasDamage: boolean;
    damageAmount?: number;
    damageDescription?: string;
  };
}

@Controller("payment-integration")
export class PaymentIntegrationController {
  constructor(
    private readonly paymentIntegrationService: PaymentIntegrationService
  ) {}

  @Get("breakdown/:bookingId")
  async getPaymentBreakdown(@Param("bookingId") bookingId: number) {
    return await this.paymentIntegrationService.calculatePaymentBreakdown(
      +bookingId
    );
  }

  @Post("process-full-payment")
  async processCompleteBookingPayment(
    @Body() dto: ProcessFullBookingPaymentDto
  ) {
    return await this.paymentIntegrationService.processCompleteBookingPayment(
      dto.bookingId,
      dto.paymentMethodId,
      dto.customSecurityDepositAmount
    );
  }

  @Post("cancel-booking")
  async handleBookingCancellation(@Body() dto: CancelBookingDto) {
    return await this.paymentIntegrationService.handleBookingCancellation(
      dto.bookingId,
      dto.cancellationReason
    );
  }

  @Post("complete-booking")
  async handleBookingCompletion(@Body() dto: CompleteBookingDto) {
    return await this.paymentIntegrationService.handleBookingCompletion(
      dto.bookingId,
      dto.damageAssessment
    );
  }

  @Get("history/:bookingId")
  async getPaymentHistory(@Param("bookingId") bookingId: number) {
    return await this.paymentIntegrationService.getPaymentHistory(+bookingId);
  }

  @Get("invoice/:bookingId")
  async generateInvoice(@Param("bookingId") bookingId: number) {
    return await this.paymentIntegrationService.generateInvoice(+bookingId);
  }
}
