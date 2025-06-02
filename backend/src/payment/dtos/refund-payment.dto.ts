import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class RefundPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  paymentId: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number; // If not provided, full refund

  @IsOptional()
  @IsString()
  reason?: string;
}
