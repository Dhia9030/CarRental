import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { TimestampEntity } from "../../Generics/timestamp.entity";
import { Booking } from "../../booking/entities/booking.entity";
import { User } from "../../user/entities/user.entity";
import { PaymentStatus, PaymentType } from "../enums/payment-status.enum";
import { Transaction } from "./transaction.entity";

@Entity()
export class Payment extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  bookingId: number;

  @ManyToOne(() => Booking, { eager: true })
  @JoinColumn({ name: "bookingId" })
  booking: Booking;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  refundedAmount: number;

  @Column({ type: "varchar", length: 3, default: "USD" })
  currency: string;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: "enum", enum: PaymentType })
  type: PaymentType;

  @Column({ type: "varchar", length: 255, nullable: true })
  stripePaymentIntentId: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  stripeChargeId: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @Column({ type: "datetime", nullable: true })
  processedAt: Date;

  @Column({ type: "datetime", nullable: true })
  refundedAt: Date;

  @Column({ type: "text", nullable: true })
  failureReason: string;

  @OneToMany(() => Transaction, (transaction) => transaction.payment, {
    cascade: true,
  })
  transactions: Transaction[];
}
