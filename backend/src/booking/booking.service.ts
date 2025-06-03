import { ForbiddenException, Injectable } from "@nestjs/common";
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateBookingDto } from "./dtos/create-booking.dto";
import { UpdateBookingDto } from "./dtos/update-booking.dto";
import { Booking } from "./entities/booking.entity";
import { Between } from "typeorm";
import { BookingStatus } from "./entities/booking.entity";
import { EventsService } from "../events/events.service";
import { Car } from "../car/entities/car.entity";
import { BookingEventType } from "src/events/booking.events";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly eventsService: EventsService,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: number
  ): Promise<Booking> {

    const startDate = new Date(createBookingDto.startDate);
    const endDate = new Date(createBookingDto.endDate);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + 12);

    if(startDate < today){
      throw new ForbiddenException("Start date must be today or a future date");
    }
    if(endDate < startDate){
      throw new ForbiddenException("End date must be after start date");
    }
    if(endDate > maxDate){
      throw new ForbiddenException("Booking end date cannot be more than 12 months in the future")
    }

    console.log(createBookingDto);
    const isAvailable = await this.isCarAvailable(
      createBookingDto.carId,
      startDate,
      endDate
    );




    if (!isAvailable) {
      throw new ForbiddenException(
        "Car is not available for the requested dates"
      );
    }

    const car = await this.carRepository.findOne( {
      where: { id: createBookingDto.carId }
    });

    if (!car) {
      throw new ForbiddenException("Car not found");
    }

    // Calculate booking duration in days
    const durationInMs = endDate.getTime() - startDate.getTime();
    const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));
    const cost = durationInDays * car.pricePerDay;

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId: userId,
      startDate: new Date(createBookingDto.startDate),
      endDate: new Date(createBookingDto.endDate),
      status: BookingStatus.Pending,
      cost: cost,
    });
    //console.log(createBookingDto.startDate)
    const savedBooking = await this.bookingRepository.save(booking);
    const completeBooking = await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: ["car", "car.agency"],
    });
    if (!completeBooking) {
      throw new ForbiddenException("Booking not found");
    }
    this.eventsService.emitBookingEvent(completeBooking , BookingEventType.BOOKING_CREATED);

    return savedBooking;
  }

  async findById(id: number): Promise<Booking | null> {
    return this.bookingRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async findByCar(carId: number): Promise<Booking[]> {
    return this.bookingRepository.find({ where: { car: { id: carId } } });
  }

  async findByUser(userId: number , agencyId?: number): Promise<Booking[]> {
    return this.bookingRepository.find({ where: { user: { id: userId }, car: { agency: { id: agencyId } } }, relations: ["car", "car.agency", "user"] });
  }

  async findByStatus(status: BookingStatus , agencyId?: number): Promise<Booking[]> {
    return await this.bookingRepository.find({ where: { status , car: { agency: { id: agencyId } } }, relations: ["car", "car.agency", "user"] });
  }

  async findByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Booking[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.bookingRepository.find({
      where: [
        { startDate: Between(start, end) },
        { endDate: Between(start, end) },
      ],
    });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto): Promise<void> {
    await this.bookingRepository.update(id, {
      ...updateBookingDto,
      startDate: updateBookingDto.startDate
        ? new Date(updateBookingDto.startDate)
        : undefined,
      endDate: updateBookingDto.endDate
        ? new Date(updateBookingDto.endDate)
        : undefined,
    });
  }

  async updateStatus(
    id: number,
    status: BookingStatus,
    agencyId?: number
  ): Promise<void> {
    if (agencyId) {
      const isOwned = await this.isBookingOwnedByAgency(id, agencyId);
      if (!isOwned) {
        throw new Error("You do not have permission to update this booking");
      }
    }

    const savedBooking = await this.bookingRepository.update(id, { status });
    const completeBooking = await this.bookingRepository.findOne({
      where: { id: id },
      relations: ["car", "car.agency"],
    });
    if (!completeBooking) {
      throw new ForbiddenException("Booking not found");
    }
    this.eventsService.emitBookingEvent(completeBooking  , BookingEventType.BOOKING_UPDATED);
  }

  async remove(id: number , agencyId : number): Promise<void> {
    const booking = await this.bookingRepository.findOne({
      where: { id, car: { agency: { id: agencyId } } },
      relations: ["car", "car.agency", "user"],
    });
    if (!booking) {
      throw new ForbiddenException("Booking not found");
    }
    await this.bookingRepository.delete(id);
  }

  async findByAgency(agencyId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { car: { agency: { id: agencyId } } },
      relations: ["car", "car.agency", "user"],
    });
  }

  async isBookingOwnedByAgency(
    bookingId: number,
    agencyId: number
  ): Promise<boolean> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ["car", "car.agency"],
    });

    if (!booking) {
      return false;
    }

    return booking.car.agency.id === agencyId;
  }

  async findByAgencyAndDateRange(
    startDate: string,
    endDate: string,
    agencyId: number
  ): Promise<Booking[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.bookingRepository.find({
      where: {
         startDate: Between(start, end) ,
         endDate: Between(start, end) ,
        car: { agency: { id: agencyId } } ,
      },
      relations: ["car", "car.agency", "user"],
    });
  }
  async findByUserAndDateRange(
    startDate: string,
    endDate: string,
    userId: number
  ): Promise<Booking[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log(userId);
    return this.bookingRepository.find({
      where: {
         startDate: Between(start, end) ,
         endDate: Between(start, end) ,
        user: { id: userId } ,
      },
      relations: ["car", "car.agency", "user"],
    });
  }

  async isCarAvailable(
    carId: number,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    // Find any bookings for this car that overlap with the requested dates
    const overlappingBookings = await this.bookingRepository.find({
      where: {
        car: { id: carId },
        startDate: LessThanOrEqual(endDate),
        endDate: MoreThanOrEqual(startDate),
        status: Not(BookingStatus.Rejected),
      },
    });

    // If there are no overlapping bookings, the car is available
    return overlappingBookings.length === 0;
  }
}
