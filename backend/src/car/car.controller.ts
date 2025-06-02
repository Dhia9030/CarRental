import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateCarDto } from './dtos/create-car.dto';
import { CarService } from './car.service';
import { UpdateCarDto } from './dtos/update-car.dto';
import { User , Agency} from 'src/auth/decorators/auth.decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';


@Controller('cars')
export class CarController {
  constructor(
    private readonly carService: CarService,
  ) {}

@Roles(Role.AGENCY)
@UseGuards(RolesGuard)
@Post()
create(@Body() createCarDto: CreateCarDto , @Agency() agency) {
  return this.carService.create(createCarDto, agency.agencyId);
}

@Roles(Role.AGENCY)
@UseGuards(RolesGuard)
@Get('agency')
findByAgency(@Agency() agency) {
  return this.carService.findByAgency(+agency.agencyId);
}
@Roles(Role.AGENCY)
@UseGuards(RolesGuard)
@Put(':id')
async update(@Param('id') id: number, @Body() updateCarDto: UpdateCarDto , @Agency() agency) {
  return await this.carService.update(+id, updateCarDto, agency.agencyId);
}

@Roles(Role.AGENCY)
@UseGuards(RolesGuard)
@Delete(':id')
async remove(@Param('id') id: number, @Agency() agency) {
  return await this.carService.remove(+id, agency.agencyId);
}
}