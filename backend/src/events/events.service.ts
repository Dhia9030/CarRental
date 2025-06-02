// src/events/events.service.ts
import { Injectable , OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BookingEvent, BookingEventType } from './booking.events';
import { BookingEventEntity } from './entities/booking-event.entity';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(BookingEventEntity)
    private readonly bookingEventRepository: Repository<BookingEventEntity>,
  ) {}



  private async saveBookingEvent(event: BookingEvent): Promise<BookingEventEntity> {
    const bookingEvent = new BookingEventEntity();
    bookingEvent.type = event.type;
    bookingEvent.data = event.data;
    bookingEvent.timestamp = event.timestamp;
    bookingEvent.bookingId = event.data.id;
    console.log("Tested");
    return this.bookingEventRepository.save(bookingEvent);
  }

  subscribeToBookingCreated(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, BookingEventType.BOOKING_CREATED).pipe(
      map(data => ({ 
        data: JSON.stringify(data) 
      }) as MessageEvent)
    );
  }

  subscribeToAgencyBookings(agencyId: number): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, BookingEventType.BOOKING_CREATED).pipe(
      filter((event: BookingEvent) => {
        return event.data.car && event.data.car.agency && event.data.car.agencyId === agencyId;
      }),
      map(data => ({ 
        data: JSON.stringify(data) 
      }) as MessageEvent)
    );
  }

  // Emit booking created event
  emitBookingCreated(booking: any): void {
    const event: BookingEvent = {
      type: BookingEventType.BOOKING_CREATED,
      data: booking,
      timestamp: new Date(),
      bookingId: booking.id,
    };
    console.log("1-Tested");
    this.bookingEventRepository.save(event);

    this.eventEmitter.emit(BookingEventType.BOOKING_CREATED, event);
  }
}