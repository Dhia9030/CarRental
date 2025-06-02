import { IsInt, IsDateString, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {

  @IsInt()
  carId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status: BookingStatus;
}