import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Agency])],
    providers: [AgencyService],
    exports: [AgencyService],
    controllers: [AgencyController],

})
export class AgencyModule { }
