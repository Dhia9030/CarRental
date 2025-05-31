import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { BookingStatus } from './entities/booking.entity';

@Controller('bookings')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @Post()
    async create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingService.create(createBookingDto);
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return this.bookingService.findById(+id);
    }

    @Get('car/:carId')
    async findByCar(@Param('carId') carId: number) {
        return this.bookingService.findByCar(+carId);
    }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: number) {
        return this.bookingService.findByUser(+userId);
    }

    @Get('status/:status')
    async findByStatus(@Param('status') status: BookingStatus) {
        return this.bookingService.findByStatus(status);
    }

    @Get('date-range')
    async findByDateRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.bookingService.findByDateRange(startDate, endDate);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateBookingDto: UpdateBookingDto,
    ) {
        return this.bookingService.update(+id, updateBookingDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.bookingService.remove(+id);
    }
}
