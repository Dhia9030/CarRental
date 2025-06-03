import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { User } from "../../user/entities/user.entity"; // Adjust path as needed
import { Car } from "../../car/entities/car.entity"; // Adjust path as needed
import { TimestampEntity } from "src/Generics/timestamp.entity";
import { OneToMany } from "typeorm";
import { Complaint } from "src/complaints/entities/complaint.entity";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { registerEnumType } from "@nestjs/graphql";
import { GraphQLISODateTime } from "@nestjs/graphql";

export enum BookingStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Rejected = "Rejected",
}
registerEnumType(BookingStatus, {
  name: "BookingStatus", // this name will be used in the GraphQL schema
});
@ObjectType()
@Entity()
export class Booking extends TimestampEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User, { nullable: true })
  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "userId" })
  user: User;

  //@Field(() => Car, { nullable: true })
  @Column({ nullable: true })
  carId: number;

  //@Field(() => Car, { nullable: true })
  @ManyToOne(() => Car, { eager: true })
  @JoinColumn({ name: "carId" })
  car: Car;

  @Field(() => GraphQLISODateTime)
  @Column({ type: "date" })
  startDate: Date;

  @Field(() => GraphQLISODateTime)
  @Column({ type: "date" })
  endDate: Date;

  @Field(() => BookingStatus)
  @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.Pending })
  status: BookingStatus;

  @Field({ nullable: true })
  @Column("decimal", { precision: 10, scale: 2 })
  cost: number;
  @OneToMany(() => Complaint, (complaint) => complaint.booking, {
    cascade: ["remove"],
    nullable: true,
    onDelete: "CASCADE",
  })
  complaints?: Complaint[];
}
