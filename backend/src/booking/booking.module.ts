import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [TypeOrmModule.forFeature([Booking]),
    EventsModule,
],
    controllers: [BookingController],
    providers: [BookingService],
    exports: [BookingService],
})
export class BookingModule {}
