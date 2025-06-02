import { IsString, IsInt, IsEnum, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';
import { FuelType } from '../enums/fuel-type.enum';

export class CreateCarDto {
    @IsString()
    @MaxLength(100)
    model: string;

    @IsString()
    @MaxLength(100)
    company: string;

    @IsInt()
    year: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    pricePerDay: number;

    @IsEnum(FuelType)
    fuelType: FuelType;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @MaxLength(200)
    location: string;

    @IsInt()
    @Min(1)
    seat: number;

}
