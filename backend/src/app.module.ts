import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AgencyModule } from './agency/agency.module';
import { CarModule } from './car/car.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [UserModule, AgencyModule, CarModule, ReviewModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
