import { Controller, Post, Get, Put, Delete, Param, Body, Query, Patch, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { BookingStatus } from './entities/booking.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { User , Agency} from 'src/auth/decorators/auth.decorators';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';


@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @Post('add')
    async create(@Body() createBookingDto: CreateBookingDto, @User() user) {
        if (!user) {
            return new  UnauthorizedException("You must be logged in as a user to create a booking");
        }
        return this.bookingService.create(createBookingDto, user.userId);
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
        return this.bookingService.findById(+id);
    }

    @Get('car/:carId')
    async findByCar(@Param('carId') carId: number) {
        return this.bookingService.findByCar(+carId);
    }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: number) {
        return this.bookingService.findByUser(+userId);
    }

    @Get('status/:status')
    async findByStatus(@Param('status') status: BookingStatus) {
        return this.bookingService.findByStatus(status);
    }

    @Get('filter/date-range')
    async findByDateRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.bookingService.findByDateRange(startDate, endDate);
    }
    @Roles(Role.AGENCY)
    @UseGuards(RolesGuard)

    @Get('agency/filter/date-range')
    async findByDateRangeAgency(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Agency() agency,
       
    ) {
        if(!agency){
            return { message: 'You must be logged in as an agency to view these bookings', bookings: [] };
        }
        return this.bookingService.findByAgencyAndDateRange(startDate, endDate , agency.agencyId);
    }
    @Get('user/filter/date-range')
    async findByDateRangeUser(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @User() user,
       
    ) {
        if(!user){
            return { message: 'You must be logged in as a user to view these bookings', bookings: [] };
        }
        return this.bookingService.findByUserAndDateRange(startDate, endDate , user.userId);
    }

    @Get()
    async findAll() {
        return this.bookingService.findAll();
    }

    @Get('agency/bookings')
    async findAgencyBookings(@Agency() agency) {
        if (!agency) {
            return { message: 'You must be logged in as an agency to view these bookings', bookings: [] };
        }
        return this.bookingService.findByAgency(agency.agencyId);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateBookingDto: UpdateBookingDto,
    ) {
        return this.bookingService.update(+id, updateBookingDto);
    }

    @Patch(':id')
    async updateStatus(
        @Param('id') id: number,
        @Body() updateBookingDto : UpdateBookingDto,
        @Agency() agency,
    ) {
        if (!agency) {
            return { message: 'You must be logged in as an agency to update these bookings', bookings: [] };
        }
        return this.bookingService.updateStatus(+id, updateBookingDto.status?? BookingStatus.Pending, agency.agencyId);
    }


    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.bookingService.remove(+id);
    }
}
