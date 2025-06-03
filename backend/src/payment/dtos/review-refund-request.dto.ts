import { IsString, IsOptional, IsEnum } from "class-validator";
import { RefundRequestStatus } from "../enums/refund-request.enum";

export class ReviewRefundRequestDto {
  @IsEnum(RefundRequestStatus)
  status: RefundRequestStatus.APPROVED | RefundRequestStatus.REJECTED;

  @IsOptional()
  @IsString()
  agencyNotes?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
