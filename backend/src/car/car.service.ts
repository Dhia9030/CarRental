import { Repository } from "typeorm";
import { CreateCarDto } from "./dtos/create-car.dto";
import { UpdateCarDto } from "./dtos/update-car.dto";
import { Car } from "./entities/car.entity";
import { InjectRepository } from "@nestjs/typeorm";


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

findByAgency(agencyId: number) {
  return this.carRepository.find({ where: { agency: { id: agencyId } } });
}

update(id: number, updateCarDto: UpdateCarDto) {
  return this.carRepository.update(id, updateCarDto);
}

remove(id: number) {
  return this.carRepository.delete(id);
}
}