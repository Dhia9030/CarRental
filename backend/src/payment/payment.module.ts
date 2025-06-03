import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentIntegrationService } from "./payment-integration.service";
import { PaymentIntegrationController } from "./payment-integration.controller";
import { RefundRequestController } from "./controllers/refund-request.controller";
import { RefundRequestService } from "./services/refund-request.service";
import { Payment } from "./entities/payment.entity";
import { Transaction } from "./entities/transaction.entity";
import { RefundRequest } from "./entities/refund-request.entity";
import { Booking } from "../booking/entities/booking.entity";
import { BookingModule } from "../booking/booking.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Transaction, RefundRequest, Booking]),
    ConfigModule,
    forwardRef(() => BookingModule),
  ],
  controllers: [PaymentController, PaymentIntegrationController, RefundRequestController],
  providers: [PaymentService, PaymentIntegrationService, RefundRequestService],
  exports: [PaymentService, PaymentIntegrationService, RefundRequestService],
})
export class PaymentModule {}
