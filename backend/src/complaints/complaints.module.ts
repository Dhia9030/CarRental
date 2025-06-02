import { Module } from "@nestjs/common";
import { ComplaintsService } from "./complaints.service";
import { ComplaintsResolver } from "./complaints.resolver";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { Complaint } from "./entities/complaint.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Complaint])],
  providers: [ComplaintsResolver, ComplaintsService],
})
export class ComplaintsModule {}
