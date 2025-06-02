import {
  Entity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { User } from "src/user/entities/user.entity";
import { Agency } from "src/agency/entities/agency.entity";
import { TimestampEntity } from "src/Generics/timestamp.entity";
import { ComplaintCategory } from "../enums/category.enum";
import { Booking } from "src/booking/entities/booking.entity";

@Entity()
@ObjectType()
export class Complaint extends TimestampEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "varchar", length: 255 })
  title: string;

  @Field()
  @Column({ type: "enum", enum: ["Client", "Agency"] })
  complainantType: "Client" | "Agency";

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.complaints, { nullable: true })
  complainantUser?: User;

  @Field(() => Agency, { nullable: true })
  @ManyToOne(() => Agency, (agency) => agency.complaintsFiled, {
    nullable: true,
  })
  complainantAgency?: Agency;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.complaintsAgainst, { nullable: true })
  againstUser?: User;

  @Field(() => Agency, { nullable: true })
  @ManyToOne(() => Agency, (agency) => agency.complaintsAgainst, {
    nullable: true,
  })
  againstAgency?: Agency;

  @Field()
  @Column({ type: "varchar", length: 100 })
  category: ComplaintCategory;

  @Field()
  @Column({ type: "enum", enum: ["Haute", "Moyenne", "Basse"] })
  priority: "Haute" | "Moyenne" | "Basse";

  @Field()
  @Column({ type: "enum", enum: ["Ouverte", "En cours", "Résolue"] })
  status: "Ouverte" | "En cours" | "Résolue";

  @Field(() => Booking)
  @ManyToOne(() => Booking, (booking) => booking.complaints)
  booking: Booking;

  @BeforeInsert()
  @BeforeUpdate()
  validateParties() {
    const isUserComplainant = !!this.complainantUser;
    const isAgencyComplainant = !!this.complainantAgency;
    const isUserTarget = !!this.againstUser;
    const isAgencyTarget = !!this.againstAgency;

    if (
      (isUserComplainant && !isAgencyTarget) ||
      (isAgencyComplainant && !isUserTarget)
    ) {
      throw new Error(
        "Invalid complaint: Complainant must be User against Agency or Agency against User"
      );
    }

    if (
      (isUserComplainant && isAgencyComplainant) ||
      (isUserTarget && isAgencyTarget)
    ) {
      throw new Error(
        "Invalid complaint: Cannot have both User and Agency as complainant or as target"
      );
    }

    if (!isUserComplainant && !isAgencyComplainant) {
      throw new Error(
        "Invalid complaint: Either complainantUser or complainantAgency must be provided"
      );
    }

    if (!isUserTarget && !isAgencyTarget) {
      throw new Error(
        "Invalid complaint: Either againstUser or againstAgency must be provided"
      );
    }
  }
}
