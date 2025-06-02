import { Controller, Param, ParseIntPipe, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Agency } from 'src/auth/decorators/auth.decorators';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}


  @Sse('bookings/agency')
  subscribeToAgencyBookings(
    @Agency() agency
  ): Observable<MessageEvent> {
    if(!agency){
      return new Observable();
    }
    return this.eventsService.subscribeToAgencyBookings(agency.agencyId);
  }

  @Sse('bookings')
  subscribeToBookings(): Observable<MessageEvent> {
    return this.eventsService.subscribeToBookingCreated();
  }

  
}