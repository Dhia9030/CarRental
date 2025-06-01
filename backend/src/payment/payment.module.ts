import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentIntegrationService } from "./payment-integration.service";
import { PaymentIntegrationController } from "./payment-integration.controller";
import { Payment } from "./entities/payment.entity";
import { Transaction } from "./entities/transaction.entity";
import { Booking } from "../booking/entities/booking.entity";
import { BookingModule } from "../booking/booking.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Transaction, Booking]),
    ConfigModule,
    forwardRef(() => BookingModule),
  ],
  controllers: [PaymentController, PaymentIntegrationController],
  providers: [PaymentService, PaymentIntegrationService],
  exports: [PaymentService, PaymentIntegrationService],
})
export class PaymentModule {}
