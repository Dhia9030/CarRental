import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { PaymentIntegrationService } from "./payment-integration.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { Agency } from "../auth/decorators/auth.decorators";

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
  @UseGuards(JwtAuthGuard)
  async getPaymentBreakdown(@Param("bookingId") bookingId: number) {
    return await this.paymentIntegrationService.calculatePaymentBreakdown(
      +bookingId
    );
  }

  @Post("process-full-payment")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENCY, Role.ADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENCY, Role.ADMIN)
  async handleBookingCancellation(@Body() dto: CancelBookingDto) {
    return await this.paymentIntegrationService.handleBookingCancellation(
      dto.bookingId,
      dto.cancellationReason
    );
  }

  @Post("complete-booking")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AGENCY, Role.ADMIN)
  async handleBookingCompletion(@Body() dto: CompleteBookingDto) {
    return await this.paymentIntegrationService.handleBookingCompletion(
      dto.bookingId,
      dto.damageAssessment
    );
  }
  @Get("history/:bookingId")
  @UseGuards(JwtAuthGuard)
  async getPaymentHistory(@Param("bookingId") bookingId: number) {
    return await this.paymentIntegrationService.getPaymentHistory(+bookingId);
  }

  @Get("invoice/:bookingId")
  @UseGuards(JwtAuthGuard)
  async generateInvoice(@Param("bookingId") bookingId: number) {
    return await this.paymentIntegrationService.generateInvoice(+bookingId);
  }
}
