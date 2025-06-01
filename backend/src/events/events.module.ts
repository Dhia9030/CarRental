import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEventEntity } from './entities/booking-event.entity';
import { EventsController } from './events.controller';
@Module({
  imports: [EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([BookingEventEntity])
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],

})
export class EventsModule {}