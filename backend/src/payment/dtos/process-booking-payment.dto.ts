import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ProcessBookingPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  bookingId: number;

  @IsOptional()
  @IsString()
  paymentMethodId?: string; // Mock payment method ID (optional for testing)

  @IsOptional()
  @IsNumber()
  securityDepositAmount?: number;

  @IsOptional()
  @IsString()
  customDescription?: string;
}
