// src/events/events.service.ts
import { Injectable , OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BookingEvent, BookingEventType } from './booking.events';
import { BookingEventEntity } from './entities/booking-event.entity';
import { Booking } from 'src/booking/entities/booking.entity';

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
        return event.data.car &&  event.data.car.agencyId === agencyId;
      }),
      map(data => ({ 
        data: JSON.stringify(data) 
      }) as MessageEvent)
    );
  }

  subscribeToUserBookings(userId: number): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, BookingEventType.BOOKING_UPDATED).pipe(
      filter((event: BookingEvent) => {
        return event.data.user && event.data.user.id === userId;
      }),
      map(data => ({ 
        data: JSON.stringify(data) 
      }) as MessageEvent)
    );
  }

  

  emitBookingEvent(booking: Booking , eventType : BookingEventType): void {
    const event: BookingEvent = {
      type: eventType,
      data: {id : booking.id,startDate: booking.startDate,endDate : booking.endDate,status: booking.status,cost : booking.cost,car : {id : booking.car.id , model : booking.car.model , agencyId :  booking.car.agency.id } , user : {id : booking.user.id , firstName : booking.user.firstName , lastName : booking.user.lastName}},
      timestamp: new Date(),
      bookingId: booking.id,
    };
    this.bookingEventRepository.save(event);

    this.eventEmitter.emit(eventType, event);

  }
}