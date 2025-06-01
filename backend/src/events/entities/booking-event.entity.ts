import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { BookingEventType } from '../booking.events';

@Entity('booking_events')
export class BookingEventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: BookingEventType,
    default: BookingEventType.BOOKING_CREATED
  })
  type: BookingEventType;

  @Column('json')
  data: any;

  @CreateDateColumn()
  timestamp: Date;

  @Column('int')
  bookingId: number;
}