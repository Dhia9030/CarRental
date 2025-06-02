import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ReviewService } from "./review.service";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { UpdateReviewDto } from "./dtos/update-review.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { User } from "../auth/decorators/auth.decorators";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { RolesGuard } from "../auth/guards/roles/roles.guard";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Public endpoint to get reviews for a car
  @Get("car/:carId")
  getCarReviews(@Param("carId") carId: number) {
    return this.reviewService.findByCarId(+carId);
  }

  // User endpoints for creating and managing reviews
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Post()
  createReview(@Body() createReviewDto: CreateReviewDto, @User() user) {
    return this.reviewService.create({
      ...createReviewDto,
      userId: user.userId,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get("user/my-reviews")
  getUserReviews(@User() user) {
    return this.reviewService.findByUserId(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Put(":id")
  updateReview(
    @Param("id") id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @User() user
  ) {
    return this.reviewService.update(+id, updateReviewDto, user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Delete(":id")
  deleteReview(@Param("id") id: number, @User() user) {
    return this.reviewService.remove(+id, user.userId);
  }

  // Admin endpoint to get all reviews
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  getAllReviews(@Query("page") page?: number, @Query("limit") limit?: number) {
    return this.reviewService.findAll(page, limit);
  }

  @Get(":id")
  getReviewById(@Param("id") id: number) {
    return this.reviewService.findOne(+id);
  }
}
