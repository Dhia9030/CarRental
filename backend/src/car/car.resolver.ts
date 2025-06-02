import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Car } from './entities/car.entity';
import { CarService } from './car.service';
import { Agency } from 'src/auth/decorators/auth.decorators';
import { Logger, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Resolver(() => Car)
export class CarResolver {
    constructor(private readonly carService: CarService){}
    private readonly logger = new Logger(CarResolver.name);
    @Query(() => [Car] )
    async findByAgency(@Args('agencyId',{type:()=>Int}) agencyId:number){
        return await this.carService.findByAgency(agencyId);    
    }
    @ResolveField('reviews')
    async reviews(@Parent() car: Car){
        this.logger.debug("Fetching reviews");
        return await car.reviews;
    }

    

}
