import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Booking])],
})
export class BookingModule {}
