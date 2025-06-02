import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarResolver } from './car.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([Car])],
    controllers: [CarController],
    providers: [CarService, CarResolver],
})
export class CarModule { }
