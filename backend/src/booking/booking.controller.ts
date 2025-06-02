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

@Roles(Role.USER)
@UseGuards(RolesGuard)
    @Post('add')
    async create(@Body() createBookingDto: CreateBookingDto, @User() user) {

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

    @Roles(Role.AGENCY)
@UseGuards(RolesGuard)

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: number , @Agency() agency) {
        return this.bookingService.findByUser(+userId , agency.agencyId);
    }

    @Roles(Role.AGENCY)
    @UseGuards(RolesGuard)

    @Get('status/:status')
    async findByStatus(@Param('status') status: BookingStatus , @Agency() agency) {
        return await this.bookingService.findByStatus(status , agency.agencyId);
    }
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)

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
    @Roles(Role.USER)
    @UseGuards(RolesGuard)
    @Get('user/filter/date-range')
    async findByDateRangeUser(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @User() user,
       
    ) {
        
        return this.bookingService.findByUserAndDateRange(startDate, endDate , user.userId);
    }

    
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Get()
    async findAll() {
        return this.bookingService.findAll();
    }
    @Roles(Role.AGENCY)
    @UseGuards(RolesGuard)
    @Get('agency/bookings')
    async findAgencyBookings(@Agency() agency) {
        
        return this.bookingService.findByAgency(agency.agencyId);
    }

    @Roles(Role.AGENCY)
    @UseGuards(RolesGuard)

    @Patch(':id')
    async updateStatus(
        @Param('id') id: number,
        @Body() updateBookingDto : UpdateBookingDto,
        @Agency() agency,
    ) {
        
        return this.bookingService.updateStatus(+id, updateBookingDto.status?? BookingStatus.Pending, agency.agencyId);
    }

    @Roles(Role.AGENCY)
    @UseGuards(RolesGuard)
    @Delete(':id')
    async remove(@Param('id') id: number , @Agency() agency) {
        return this.bookingService.remove(+id , agency.agencyId);
    }
}
