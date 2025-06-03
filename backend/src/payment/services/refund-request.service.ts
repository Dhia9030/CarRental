import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RefundRequest } from "../entities/refund-request.entity";
import { RefundRequestStatus } from "../enums/refund-request.enum";
import { Payment } from "../entities/payment.entity";
import { Booking } from "../../booking/entities/booking.entity";
import { CreateRefundRequestDto } from "../dtos/create-refund-request.dto";
import { ReviewRefundRequestDto } from "../dtos/review-refund-request.dto";
import { PaymentService } from "../payment.service";

@Injectable()
export class RefundRequestService {
  constructor(
    @InjectRepository(RefundRequest)
    private refundRequestRepository: Repository<RefundRequest>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private paymentService: PaymentService
  ) {}

  async createRefundRequest(
    userId: number,
    dto: CreateRefundRequestDto
  ): Promise<RefundRequest> {
    // Validate payment exists and belongs to user
    const payment = await this.paymentRepository.findOne({
      where: { id: dto.paymentId },
      relations: ["booking"],
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    if (payment.userId !== userId) {
      throw new ForbiddenException("You can only request refunds for your own payments");
    }

    // Validate booking exists and belongs to user
    const booking = await this.bookingRepository.findOne({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException("You can only request refunds for your own bookings");
    }

    // Validate refund amount doesn't exceed available amount
    const availableAmount = payment.amount - payment.refundedAmount;
    if (dto.requestedAmount > availableAmount) {
      throw new BadRequestException(
        `Requested amount ($${dto.requestedAmount}) exceeds available amount ($${availableAmount})`
      );
    }

    // Check if there's already a pending request for this payment
    const existingRequest = await this.refundRequestRepository.findOne({
      where: {
        paymentId: dto.paymentId,
        status: RefundRequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new BadRequestException("There is already a pending refund request for this payment");
    }

    const refundRequest = this.refundRequestRepository.create({
      ...dto,
      requestedByUserId: userId,
    });

    return await this.refundRequestRepository.save(refundRequest);
  }

  async getRefundRequestsByUser(userId: number): Promise<RefundRequest[]> {
    return await this.refundRequestRepository.find({
      where: { requestedByUserId: userId },
      order: { createdAt: "DESC" },
    });
  }

  async getRefundRequestsByAgency(agencyId: number): Promise<RefundRequest[]> {
    return await this.refundRequestRepository
      .createQueryBuilder("refundRequest")
      .leftJoinAndSelect("refundRequest.payment", "payment")
      .leftJoinAndSelect("refundRequest.booking", "booking")
      .leftJoinAndSelect("refundRequest.requestedByUser", "user")
      .leftJoinAndSelect("booking.car", "car")
      .where("car.agencyId = :agencyId", { agencyId })
      .orderBy("refundRequest.createdAt", "DESC")
      .getMany();
  }

  async getRefundRequestById(id: number): Promise<RefundRequest> {
    const request = await this.refundRequestRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException("Refund request not found");
    }

    return request;
  }

  async reviewRefundRequest(
    requestId: number,
    agencyId: number,
    dto: ReviewRefundRequestDto
  ): Promise<RefundRequest> {
    const refundRequest = await this.refundRequestRepository.findOne({
      where: { id: requestId },
      relations: ["booking", "booking.car", "payment"],
    });

    if (!refundRequest) {
      throw new NotFoundException("Refund request not found");
    }

    // Verify the agency owns the car for this booking
    if (refundRequest.booking.car.agencyId !== agencyId) {
      throw new ForbiddenException("You can only review refund requests for your own bookings");
    }

    if (refundRequest.status !== RefundRequestStatus.PENDING) {
      throw new BadRequestException("This refund request has already been reviewed");
    }    // Update the refund request
    refundRequest.status = dto.status;
    refundRequest.reviewedByAgencyId = agencyId;
    if (dto.agencyNotes) {
      refundRequest.agencyNotes = dto.agencyNotes;
    }
    if (dto.rejectionReason) {
      refundRequest.rejectionReason = dto.rejectionReason;
    }
    refundRequest.reviewedAt = new Date();

    await this.refundRequestRepository.save(refundRequest);

    // If approved, process the refund
    if (dto.status === RefundRequestStatus.APPROVED) {
      await this.processApprovedRefund(refundRequest);
    }

    return refundRequest;
  }

  private async processApprovedRefund(refundRequest: RefundRequest): Promise<void> {
    try {
      // Use the existing payment service to process the refund
      await this.paymentService.refundPayment({
        paymentId: refundRequest.paymentId,
        amount: refundRequest.requestedAmount,
        reason: `Approved refund request #${refundRequest.id}: ${refundRequest.reason}`,
      });

      // Update the refund request status to processed
      refundRequest.status = RefundRequestStatus.PROCESSED;
      refundRequest.processedAt = new Date();
      await this.refundRequestRepository.save(refundRequest);
    } catch (error) {
      console.error("Failed to process approved refund:", error);
      throw new BadRequestException("Failed to process refund. Please try again.");
    }
  }

  async getAllRefundRequests(): Promise<RefundRequest[]> {
    return await this.refundRequestRepository.find({
      order: { createdAt: "DESC" },
    });
  }
}
