import { Controller, Get } from "@nestjs/common";
import { PaymentService } from "../payment/payment.service";
import { Connection } from "typeorm";

@Controller("health")
export class HealthController {
  constructor(
    private readonly connection: Connection,
    private readonly paymentService: PaymentService
  ) {}

  @Get()
  async checkHealth() {
    const healthStatus = {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: "unknown",
        payment: "unknown",
      },
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
    };

    try {
      // Check database connection
      await this.connection.query("SELECT 1");
      healthStatus.services.database = "healthy";
    } catch (error) {
      healthStatus.services.database = "unhealthy";
      healthStatus.status = "error";
    }

    try {
      // Check payment service (Stripe connectivity)
      // This is a simple check - in production you might want to ping Stripe API
      if (process.env.STRIPE_SECRET_KEY) {
        healthStatus.services.payment = "configured";
      } else {
        healthStatus.services.payment = "not_configured";
      }
    } catch (error) {
      healthStatus.services.payment = "unhealthy";
    }

    return healthStatus;
  }

  @Get("ready")
  async checkReadiness() {
    try {
      // Check if all required services are ready
      await this.connection.query("SELECT 1");

      return {
        status: "ready",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "not_ready",
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  @Get("live")
  checkLiveness() {
    // Simple liveness check - just return OK if the app is running
    return {
      status: "alive",
      timestamp: new Date().toISOString(),
    };
  }
}
