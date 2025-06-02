import { Controller, Param, ParseIntPipe, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Agency } from 'src/auth/decorators/auth.decorators';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}


  @Roles(Role.AGENCY)
  @UseGuards(RolesGuard)
  @Sse('bookings/agency')
  subscribeToAgencyBookings(
    @Agency() agency
  ): Observable<MessageEvent> {
    return this.eventsService.subscribeToAgencyBookings(agency.agencyId);
  }


  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Sse('bookings')
  subscribeToBookings(): Observable<MessageEvent> {
    return this.eventsService.subscribeToBookingCreated();
  }

  
}