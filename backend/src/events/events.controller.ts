import { Controller, Param, ParseIntPipe, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}


  @Sse('bookings/agency/:agencyId')
  subscribeToAgencyBookings(
    @Param('agencyId', ParseIntPipe) agencyId: number
  ): Observable<MessageEvent> {
    return this.eventsService.subscribeToAgencyBookings(agencyId);
  }

  @Sse('bookings')
  subscribeToBookings(): Observable<MessageEvent> {
    return this.eventsService.subscribeToBookingCreated();
  }

  
}