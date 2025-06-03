import { IsNumber, IsEnum, IsOptional, IsString, Min } from "class-validator";
import { RefundRequestType } from "../enums/refund-request.enum";

export class CreateRefundRequestDto {
  @IsNumber()
  paymentId: number;

  @IsNumber()
  bookingId: number;

  @IsNumber()
  @Min(0.01)
  requestedAmount: number;

  @IsEnum(RefundRequestType)
  type: RefundRequestType;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
