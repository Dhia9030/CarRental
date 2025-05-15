import { IsInt, IsDateString, IsEnum, IsNumber, Min } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsInt()
  userId: number;

  @IsInt()
  carId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsNumber()
  @Min(0)
  cost: number;
}