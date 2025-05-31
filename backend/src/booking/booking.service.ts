import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { Between } from 'typeorm';
import { BookingStatus } from './entities/booking.entity';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
    ) {}

    async create(createBookingDto: CreateBookingDto): Promise<Booking> {
        const booking = this.bookingRepository.create({
            ...createBookingDto,
            startDate: new Date(createBookingDto.startDate),
            endDate: new Date(createBookingDto.endDate)
        });
        console.log(createBookingDto.startDate)
        return this.bookingRepository.save(booking);
    }

    async findById(id: number): Promise<Booking | null> {
        return this.bookingRepository.findOne({ where: { id } });
    }

    async findByCar(carId: number): Promise<Booking[]> {
        return this.bookingRepository.find({ where: { car: { id: carId } } });
    }

    async findByUser(userId: number): Promise<Booking[]> {
        return this.bookingRepository.find({ where: { user: { id: userId } } });
    }

    async findByStatus(status: BookingStatus): Promise<Booking[]> {
        return this.bookingRepository.find({  where : { status } });
    }

    async findByDateRange(startDate: string, endDate: string): Promise<Booking[]> {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.bookingRepository.find({
            where: [
                { startDate: Between(start, end) },
                { endDate: Between(start, end) }
            ]
        });
    }

    async update(id: number, updateBookingDto: UpdateBookingDto): Promise<void> {
        await this.bookingRepository.update(id, {
            ...updateBookingDto,
            startDate: updateBookingDto.startDate ? new Date(updateBookingDto.startDate) : undefined,
            endDate: updateBookingDto.endDate ? new Date(updateBookingDto.endDate) : undefined
        });
    }

    async updateStatus(id: number, status: BookingStatus): Promise<void> {
        await this.bookingRepository.update(id, { status });
    }

    async remove(id: number): Promise<void> {
        await this.bookingRepository.delete(id);
    }
}
