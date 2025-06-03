import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { RefundRequestService } from "../services/refund-request.service";
import { CreateRefundRequestDto } from "../dtos/create-refund-request.dto";
import { ReviewRefundRequestDto } from "../dtos/review-refund-request.dto";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { Role } from "../../auth/enums/role.enum";
import { User, Agency } from "../../auth/decorators/auth.decorators";

@Controller("refund-requests")
@UseGuards(JwtAuthGuard)
export class RefundRequestController {
  constructor(private readonly refundRequestService: RefundRequestService) {}

  // Client endpoints
  @Post()
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  async createRefundRequest(
    @User() user: any,
    @Body() dto: CreateRefundRequestDto
  ) {
    return await this.refundRequestService.createRefundRequest(user.userId, dto);
  }

  @Get("my-requests")
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  async getMyRefundRequests(@User() user: any) {
    return await this.refundRequestService.getRefundRequestsByUser(user.userId);
  }

  // Agency endpoints
  @Get("agency")
  @Roles(Role.AGENCY)
  @UseGuards(RolesGuard)
  async getAgencyRefundRequests(@Agency() agency: any) {
    return await this.refundRequestService.getRefundRequestsByAgency(agency.agencyId);
  }

  @Post(":id/approve")
  @Roles(Role.AGENCY)
  @UseGuards(RolesGuard)
  async approveRefundRequest(
    @Param("id", ParseIntPipe) id: number,
    @Agency() agency: any,
    @Body() dto: { agencyNotes?: string }
  ) {
    const reviewDto: ReviewRefundRequestDto = {
      status: "APPROVED" as any,
      agencyNotes: dto.agencyNotes,
    };
    return await this.refundRequestService.reviewRefundRequest(id, agency.agencyId, reviewDto);
  }

  @Post(":id/reject")
  @Roles(Role.AGENCY)
  @UseGuards(RolesGuard)
  async rejectRefundRequest(
    @Param("id", ParseIntPipe) id: number,
    @Agency() agency: any,
    @Body() dto: { rejectionReason: string; agencyNotes?: string }
  ) {
    const reviewDto: ReviewRefundRequestDto = {
      status: "REJECTED" as any,
      rejectionReason: dto.rejectionReason,
      agencyNotes: dto.agencyNotes,
    };
    return await this.refundRequestService.reviewRefundRequest(id, agency.agencyId, reviewDto);
  }

  // Admin endpoints
  @Get("admin/all")
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async getAllRefundRequests() {
    return await this.refundRequestService.getAllRefundRequests();
  }

  @Get(":id")
  async getRefundRequestById(@Param("id", ParseIntPipe) id: number) {
    return await this.refundRequestService.getRefundRequestById(id);
  }
}
