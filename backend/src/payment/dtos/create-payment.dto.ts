import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  Min,
  IsObject,
} from "class-validator";
import { PaymentType } from "../enums/payment-status.enum";

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  bookingId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = "USD";

  @IsNotEmpty()
  @IsEnum(PaymentType)
  type: PaymentType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  paymentMethodId?: string; // Stripe payment method ID
}
