import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TimestampEntity } from "../../Generics/timestamp.entity";
import { Payment } from "./payment.entity";
import { TransactionType } from "../enums/payment-status.enum";

@Entity()
export class Transaction extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  paymentId: number;

  @ManyToOne(() => Payment, (payment) => payment.transactions)
  @JoinColumn({ name: "paymentId" })
  payment: Payment;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "varchar", length: 3, default: "USD" })
  currency: string;

  @Column({ type: "enum", enum: TransactionType })
  type: TransactionType;

  @Column({ type: "varchar", length: 255, nullable: true })
  stripeTransactionId: string;

  @Column({ type: "varchar", length: 50 })
  status: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "json", nullable: true })
  stripeResponse: Record<string, any>;

  @Column({ type: "text", nullable: true })
  failureReason: string;

  @Column({ type: "datetime", nullable: true })
  processedAt: Date;
}
