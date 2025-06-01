import { Test, TestingModule } from "@nestjs/testing";
import { PaymentIntegrationService } from "./payment-integration.service";
import { PaymentService } from "./payment.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { Transaction } from "./entities/transaction.entity";
import { Booking } from "../booking/entities/booking.entity";
import { BookingService } from "../booking/booking.service";

describe("PaymentIntegrationService", () => {
  let service: PaymentIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentIntegrationService,
        {
          provide: PaymentService,
          useValue: {
            createPaymentIntent: jest.fn(),
            confirmPayment: jest.fn(),
            processRefund: jest.fn(),
          },
        },
        {
          provide: BookingService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentIntegrationService>(PaymentIntegrationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
