import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Car } from "../../car/entities/car.entity";
import { TimestampEntity } from "src/Generics/timestamp.entity";
import { Complaint } from "src/complaints/entities/complaint.entity";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
@Entity()
@Unique(["email"])
//@Unique(["username"])

export class Agency extends TimestampEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: "varchar", length: 100, nullable: false })
  email: string;

  @Column({
    type: "varchar",
    length: 255, // enough for most hash formats
    nullable: false,
    select: false, // do not select password by default
  })
  password: string;


  @Field()
  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  username: string;

  //@Field(() => [Car])
  @OneToMany(() => Car, (car) => car.agency)
  cars: Car[];

  @Field(() => [Complaint], { nullable: true })
  @OneToMany(() => Complaint, (complaint) => complaint.complainantAgency)
  complaintsFiled: Complaint[];

  @Field(() => [Complaint], { nullable: true })
  @OneToMany(() => Complaint, (complaint) => complaint.againstAgency)
  complaintsAgainst: Complaint[];


}
