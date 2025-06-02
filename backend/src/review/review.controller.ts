import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Agency, User } from 'src/auth/decorators/auth.decorators';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Roles(Role.USER)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
      constructor(
        private readonly reviewService: ReviewService,
      ) {}

    @Get()
    async findAll() {
        return this.reviewService.findAll();
    }

    @Post()
    create(@Body() createReviewDto: CreateReviewDto  , @User() user) {
        console.log(user)
      createReviewDto.userId = +user.userId;
      return this.reviewService.create(createReviewDto,+user.userId);
    }
    
    
    @Put(':id')
    update(@Param('id') id: number, @Body() updateReviewDto: UpdateReviewDto) {
      return this.reviewService.update(+id, updateReviewDto);
    }
    
    @Delete(':id')
    remove(@Param('id') id: number) {
      return this.reviewService.remove(+id);
    }
}
