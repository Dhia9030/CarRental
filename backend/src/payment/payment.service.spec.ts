import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "./payment.service";
import { PaymentIntegrationService } from "./payment-integration.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Payment } from "./entities/payment.entity";
import { Transaction } from "./entities/transaction.entity";
import { Booking } from "../booking/entities/booking.entity";
import { BookingService } from "../booking/booking.service";

describe("PaymentService", () => {
  let service: PaymentService;
  let integrationService: PaymentIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        PaymentIntegrationService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: BookingService,
          useValue: {
            findById: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case "STRIPE_SECRET_KEY":
                  return "sk_test_mock_key";
                case "STRIPE_WEBHOOK_SECRET":
                  return "whsec_mock_secret";
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    integrationService = module.get<PaymentIntegrationService>(
      PaymentIntegrationService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(integrationService).toBeDefined();
  });

  it("should create payment service with stripe configuration", () => {
    expect(service).toBeDefined();
    // Stripe instance should be initialized
  });
});
