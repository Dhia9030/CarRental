import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TimestampEntity } from "../../Generics/timestamp.entity";
import { Payment } from "./payment.entity";
import { User } from "../../user/entities/user.entity";
import { Booking } from "../../booking/entities/booking.entity";
import { RefundRequestStatus, RefundRequestType } from "../enums/refund-request.enum";

@Entity()
export class RefundRequest extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  paymentId: number;

  @ManyToOne(() => Payment, { eager: true })
  @JoinColumn({ name: "paymentId" })
  payment: Payment;

  @Column({ nullable: false })
  bookingId: number;

  @ManyToOne(() => Booking, { eager: true })
  @JoinColumn({ name: "bookingId" })
  booking: Booking;

  @Column({ nullable: false })
  requestedByUserId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "requestedByUserId" })
  requestedByUser: User;

  @Column("decimal", { precision: 10, scale: 2 })
  requestedAmount: number;

  @Column({ type: "enum", enum: RefundRequestType })
  type: RefundRequestType;
  @Column({ type: "text", nullable: true })
  reason?: string;

  @Column({ type: "enum", enum: RefundRequestStatus, default: RefundRequestStatus.PENDING })
  status: RefundRequestStatus;
  @Column({ nullable: true })
  reviewedByAgencyId?: number;

  @Column({ type: "text", nullable: true })
  agencyNotes?: string;

  @Column({ type: "datetime", nullable: true })
  reviewedAt?: Date;

  @Column({ type: "datetime", nullable: true })
  processedAt?: Date;

  @Column({ type: "text", nullable: true })
  rejectionReason?: string;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;
}
