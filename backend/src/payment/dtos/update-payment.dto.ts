import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  Min,
  IsDateString,
} from "class-validator";
import { PaymentStatus } from "../enums/payment-status.enum";

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;

  @IsOptional()
  @IsString()
  stripeChargeId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  failureReason?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  refundedAmount?: number;

  @IsOptional()
  @IsDateString()
  processedAt?: Date;

  @IsOptional()
  @IsDateString()
  refundedAt?: Date;
}
