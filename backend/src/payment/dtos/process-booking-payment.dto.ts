import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ProcessBookingPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  bookingId: number;

  @IsNotEmpty()
  @IsString()
  paymentMethodId: string; // Stripe payment method ID

  @IsOptional()
  @IsNumber()
  securityDepositAmount?: number;

  @IsOptional()
  @IsString()
  customDescription?: string;
}
