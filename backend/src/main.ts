import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Enable CORS with specific origin (your frontend)
  app.enableCors({
    origin: "http://localhost:3001", // replace with your frontend's URL
    credentials: true, // if you send cookies or auth headers
  });
  await app.listen(3000);
}
bootstrap();
