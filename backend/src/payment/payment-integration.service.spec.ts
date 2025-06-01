import { Test, TestingModule } from "@nestjs/testing";
import { PaymentIntegrationService } from "./payment-integration.service";
import { PaymentService } from "./payment.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "./entities/payment.entity";
import { Transaction } from "./entities/transaction.entity";
import { Booking } from "../booking/entities/booking.entity";
import { BookingService } from "../booking/booking.service";
import {
  PaymentStatus,
  PaymentType,
  TransactionType,
} from "./enums/payment-status.enum";

describe("PaymentIntegrationService", () => {
  let service: PaymentIntegrationService;
  let paymentService: PaymentService;
  let bookingService: BookingService;
  let paymentRepository: Repository<Payment>;
  let transactionRepository: Repository<Transaction>;
  let bookingRepository: Repository<Booking>;

  const mockPaymentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockTransactionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockBookingRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const mockPaymentService = {
    createPaymentIntent: jest.fn(),
    confirmPayment: jest.fn(),
    processRefund: jest.fn(),
    processBookingPayment: jest.fn(),
    findByBooking: jest.fn(),
    createPayment: jest.fn(),
    refundPayment: jest.fn(),
    releaseSecurityDeposit: jest.fn(),
  };

  const mockBookingService = {
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentIntegrationService,
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentIntegrationService>(PaymentIntegrationService);
    paymentService = module.get<PaymentService>(PaymentService);
    bookingService = module.get<BookingService>(BookingService);
    paymentRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment)
    );
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction)
    );
    bookingRepository = module.get<Repository<Booking>>(
      getRepositoryToken(Booking)
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("calculatePaymentBreakdown", () => {
    it("should calculate correct payment breakdown", async () => {
      const mockBooking = {
        id: 1,
        cost: 100,
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-03-05"),
        status: "Confirmed",
        user: { id: 1 },
        car: { id: 1, pricePerDay: 25 },
      };

      mockBookingService.findById.mockResolvedValue(mockBooking);

      const breakdown = await service.calculatePaymentBreakdown(1);

      expect(breakdown).toEqual({
        baseRentalCost: 100,
        numberOfDays: 4,
        dailyRate: 25,
        securityDepositRate: 0.2,
        securityDepositAmount: 20,
        totalAmount: 120,
        taxes: 0,
        fees: 0,
      });
    });

    it("should throw error for non-existent booking", async () => {
      mockBookingService.findById.mockResolvedValue(null);

      await expect(service.calculatePaymentBreakdown(999)).rejects.toThrow(
        "Booking not found"
      );
    });
  });

  describe("processFullPayment", () => {
    it("should process full payment successfully", async () => {
      const mockBooking = {
        id: 1,
        cost: 100,
        status: "Confirmed",
        user: { id: 1 },
        car: { id: 1 },
      };

      const mockPaymentIntent = {
        id: "pi_test123",
        client_secret: "pi_test123_secret",
        amount: 12000, // $120.00 in cents
        status: "requires_payment_method",
      };

      const mockPayment = {
        id: 1,
        amount: 120,
        stripePaymentIntentId: "pi_test123",
        status: PaymentStatus.PENDING,
        type: PaymentType.BOOKING_PAYMENT,
      };

      mockBookingRepository.findOne.mockResolvedValue(mockBooking);
      mockPaymentService.createPaymentIntent.mockResolvedValue(
        mockPaymentIntent
      );
      mockPaymentRepository.create.mockReturnValue(mockPayment);
      mockPaymentRepository.save.mockResolvedValue(mockPayment);
      const result = await service.processCompleteBookingPayment(
        1,
        "pm_test123"
      );

      expect(result).toEqual({
        paymentIntentId: "pi_test123",
        clientSecret: "pi_test123_secret",
        amount: 120,
        breakdown: {
          bookingCost: 100,
          securityDeposit: 20,
          totalAmount: 120,
          breakdown: {
            baseRental: 100,
            securityDeposit: 20,
            taxes: 0,
            fees: 0,
          },
        },
      });

      expect(mockPaymentService.createPaymentIntent).toHaveBeenCalledWith({
        amount: 12000,
        currency: "usd",
        paymentMethodId: "pm_test123",
        customerId: undefined,
        metadata: {
          bookingId: "1",
          userId: "1",
          type: "booking_payment",
        },
      });
    });
  });
  describe("handleBookingCancellation", () => {
    it("should process cancellation with refund", async () => {
      const mockBooking = {
        id: 1,
        cost: 100,
        startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: "Confirmed",
        user: { id: 1 },
      };

      const mockPayments = [
        {
          id: 1,
          amount: 120,
          stripePaymentIntentId: "pi_test123",
          status: PaymentStatus.COMPLETED,
          type: PaymentType.BOOKING_PAYMENT,
          userId: 1,
        },
      ];

      mockBookingService.findById.mockResolvedValue(mockBooking);
      mockPaymentService.findByBooking.mockResolvedValue(mockPayments);
      mockPaymentService.createPayment.mockResolvedValue({
        id: 2,
        amount: 12,
        type: PaymentType.CANCELLATION_FEE,
      });
      mockPaymentService.refundPayment.mockResolvedValue({
        id: "re_test123",
        amount: 108,
        status: "succeeded",
      });
      mockBookingService.updateStatus.mockResolvedValue({});

      const result = await service.handleBookingCancellation(
        1,
        "Customer request"
      );

      expect(result.refunds).toHaveLength(1);
      expect(result.cancellationFee).toBeDefined();
      expect(mockPaymentService.refundPayment).toHaveBeenCalled();
    });
  });
});
