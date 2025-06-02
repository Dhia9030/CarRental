import { Module  } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AgencyModule } from "./agency/agency.module";
import { CarModule } from "./car/car.module";
import { ReviewModule } from "./review/review.module";
import { BookingModule } from "./booking/booking.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventsModule } from "./events/events.module";
import { AuthModule } from "./auth/auth.module";
import { ComplaintsModule } from "./complaints/complaints.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { PaymentModule } from "./payment/payment.module";
import { HealthModule } from "./health/health.module";
import { ChatModule } from "./chat/chat.module";
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: true, // Enables browser UI
      introspection: true, // Required for playground in production
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        autoLoadEntities: true,
        driver: require("mysql2"),
        synchronize: false,
        migrationsRun: true,
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AgencyModule,
    CarModule,
    ReviewModule,
    BookingModule,
    EventsModule,
    AuthModule,
    ComplaintsModule,
    PaymentModule,
    HealthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
