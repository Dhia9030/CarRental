import { Repository } from "typeorm";
import { CreateCarDto } from "./dtos/create-car.dto";
import { UpdateCarDto } from "./dtos/update-car.dto";
import { Car } from "./entities/car.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { urlToHttpOptions } from "url";
import { ForbiddenException } from "@nestjs/common";


@Injectable()
export class CarService{

    constructor(
      @InjectRepository(Car)
      private readonly carRepository: Repository<Car>) {}

    async create(createCarDto: CreateCarDto, agencyId: number) {
        const car = this.carRepository.create({
            ...createCarDto,
            agency: { id: agencyId }
        });
        return this.carRepository.save(car);
}

findByAgency(agencyId: number):Promise<Car[]> {
  return this.carRepository.find({ where: { agency: { id: agencyId } } ,relations:['reviews']});
}

async update(id: number, updateCarDto: UpdateCarDto, agencyId: number) {

  const car = await this.carRepository.findOne({ 
    where: { 
      id,
      agency: { id: agencyId } 
    },
    relations: ['agency']
  });
  if (!car) {
    throw new ForbiddenException('Car not found');
  }
  return this.carRepository.update(id, updateCarDto);
}

async remove(id: number, agencyId: number) {
  const car = await this.carRepository.findOne({ 
    where: { 
      id,
      agency: { id: agencyId } 
    },
    relations: ['agency']
  });
  if (!car) {
    throw new ForbiddenException('Car not found');
  }
  return this.carRepository.delete(id);
}
}