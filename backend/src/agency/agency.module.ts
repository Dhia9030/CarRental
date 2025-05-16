import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Agency])],
})
export class AgencyModule { }
