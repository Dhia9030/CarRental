import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./entities/review.entity";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { UpdateReviewDto } from "./dtos/update-review.dto";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async findByCarId(carId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { car: { id: carId } },
      order: { createdAt: "DESC" },
    });
  }

  async findByUserId(userId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" },
    });
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    userId: number
  ): Promise<Review> {
    const review = await this.findOne(id);

    // Check if the user owns this review
    if (review.user.id !== userId) {
      throw new ForbiddenException("You can only update your own reviews");
    }

    await this.reviewRepository.update(id, updateReviewDto);
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const review = await this.findOne(id);

    // Check if the user owns this review
    if (review.user.id !== userId) {
      throw new ForbiddenException("You can only delete your own reviews");
    }

    await this.reviewRepository.delete(id);
  }

  async getAverageRating(carId: number): Promise<number> {
    const result = await this.reviewRepository
      .createQueryBuilder("review")
      .select("AVG(review.value)", "average")
      .where("review.carId = :carId", { carId })
      .getRawOne();

    return parseFloat(result.average) || 0;
  }
}
