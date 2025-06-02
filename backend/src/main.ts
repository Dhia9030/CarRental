import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  // Enable CORS for frontend access
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ],
    credentials: true,
  });

  // Swagger API Documentation setup
  const config = new DocumentBuilder()
    .setTitle("CarRental API")
    .setDescription(
      "The CarRental API documentation - Complete endpoints for car rental management system"
    )
    .setVersion("1.0")
    .addTag("auth", "Authentication endpoints")
    .addTag("cars", "Car management endpoints")
    .addTag("bookings", "Booking management endpoints")
    .addTag("users", "User management endpoints")
    .addTag("agencies", "Agency management endpoints")
    .addTag("reviews", "Review management endpoints")
    .addTag("payments", "Payment processing endpoints")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document, {
    customSiteTitle: "CarRental API Documentation",
    customfavIcon: "/favicon.ico",
    customCss: `
      .topbar-wrapper { display: none }
      .swagger-ui .topbar { display: none }
      .swagger-ui .scheme-container { background: #fafafa; padding: 10px; border-radius: 5px; margin: 10px 0; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "none",
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
  });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger API Documentation available at: http://localhost:${port}/api-docs`
  );
  console.log(
    `🔗 You can now test all endpoints through the Swagger UI interface!`
  );
}
bootstrap();
