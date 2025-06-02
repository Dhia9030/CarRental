import { Injectable } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>) {}

    async create(createReviewDto: CreateReviewDto , userId:number) {
        const review = this.reviewRepository.create({
            ...createReviewDto,
            user: {id: userId},
        });
        return this.reviewRepository.save(review);
    }
    findAll():Promise<Review[]>{
        return this.reviewRepository.find();
    }
    findByCar(carId: number) {
      return this.reviewRepository.find({ where: { car: { id: carId } } });
    }
    
    update(id: number, updateReviewDto: UpdateReviewDto) {
      return this.reviewRepository.update(id, updateReviewDto);
    }
    
    remove(id: number) {
      return this.reviewRepository.delete(id);
    }
}
