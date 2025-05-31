import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCarDto } from './dtos/create-car.dto';
import { CarService } from './car.service';
import { UpdateCarDto } from './dtos/update-car.dto';


@Controller('cars')
export class CarController {
  constructor(
    private readonly carService: CarService,
  ) {}

@Post()
create(@Body() createCarDto: CreateCarDto) {
  return this.carService.create(createCarDto, 1);//harcoded agencyId lin nkamlou auth
}

@Get('/agency/:agencyId')
findByAgency(@Param('agencyId') agencyId: number) {
  return this.carService.findByAgency(+agencyId);
}

@Put(':id')
update(@Param('id') id: number, @Body() updateCarDto: UpdateCarDto) {
  return this.carService.update(+id, updateCarDto);
}

@Delete(':id')
remove(@Param('id') id: number) {
  return this.carService.remove(+id);
}
}