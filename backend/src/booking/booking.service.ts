import { ForbiddenException, Injectable } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { Between } from 'typeorm';
import { BookingStatus } from './entities/booking.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class BookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        private readonly eventsService: EventsService
    ) {}

    async create(createBookingDto: CreateBookingDto , userId : number): Promise<Booking> {
        console.log(createBookingDto);
        const isAvailable = await this.isCarAvailable(createBookingDto.carId, new Date(createBookingDto.startDate), new Date(createBookingDto.endDate));
        if (!isAvailable) {
            throw new ForbiddenException('Car is not available for the requested dates');
        }
        const booking = this.bookingRepository.create({
            ...createBookingDto,
            userId : userId,
            startDate: new Date(createBookingDto.startDate),
            endDate: new Date(createBookingDto.endDate),
            status: BookingStatus.Pending
        });
        //console.log(createBookingDto.startDate)
        const savedBooking = await this.bookingRepository.save(booking);
        const completeBooking = await this.bookingRepository.findOne({
            where: { id: savedBooking.id },
            relations: ['car', 'car.agency']
        });
        this.eventsService.emitBookingCreated(completeBooking);

        return savedBooking;
    }

    async findById(id: number): Promise<Booking | null> {
        return this.bookingRepository.findOne({ where: { id } });
        
    }

    async findAll():Promise<Booking[]> {
        return this.bookingRepository.find();
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

    async updateStatus(id: number, status: BookingStatus , agencyId?: number): Promise<void> {
        if (agencyId) {
            const isOwned = await this.isBookingOwnedByAgency(id, agencyId);
            if (!isOwned) {
                throw new Error('You do not have permission to update this booking');
            }
        }
        
        await this.bookingRepository.update(id, { status });
    }

    async remove(id: number): Promise<void> {
        await this.bookingRepository.delete(id);
    }

    async findByAgency(agencyId: number): Promise<Booking[]> {
        return this.bookingRepository.find({
            where: { car: { agency: { id: agencyId } } },
            relations: ['car', 'car.agency', 'user']
        });
    }

    async isBookingOwnedByAgency(bookingId: number, agencyId: number): Promise<boolean> {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
            relations: ['car', 'car.agency']
        });

        if (!booking) {
            return false;
        }

        return booking.car.agency.id === agencyId;
    }


    async findByAgencyAndDateRange(startDate: string, endDate: string, agencyId: number): Promise<Booking[]> {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.bookingRepository.find({
            where: [
                { startDate: Between(start, end) },
                { endDate: Between(start, end) },
                { car: { agency: { id: agencyId } } }
            ],
            relations: ['car', 'car.agency', 'user']
        });
    }
    async findByUserAndDateRange(startDate: string, endDate: string, userId: number): Promise<Booking[]> {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.bookingRepository.find({
            where: [
                { startDate: Between(start, end) },
                { endDate: Between(start, end) },
                { user: { id: userId } }
            ],
            relations: ['car', 'car.agency', 'user']
        });
    }


    async isCarAvailable(carId: number, startDate: Date, endDate: Date): Promise<boolean> {
        // Find any bookings for this car that overlap with the requested dates
        const overlappingBookings = await this.bookingRepository.find({
            where: {
                car: { id: carId },
                startDate: LessThanOrEqual(endDate),
                endDate: MoreThanOrEqual(startDate),
                status: Not(BookingStatus.Rejected)
            }
        });
        
        // If there are no overlapping bookings, the car is available
        return overlappingBookings.length === 0;
    }
}
