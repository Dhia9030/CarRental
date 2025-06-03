
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { TimestampEntity } from 'src/Generics/timestamp.entity';
import { Field, Int, ObjectType, ID } from '@nestjs/graphql'
import { Complaint } from "src/complaints/entities/complaint.entity";


@ObjectType()
@Entity()
export class Agency extends TimestampEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,  // enough for most hash formats 
    nullable: false,
    select: false  // do not select password by default
  })
  password: string;

  @Field()
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  username: string;

  @Field(() => [Car])
  @OneToMany(() => Car, car => car.agency)
  cars: Promise<Car[]>;




  @Field(() => [Complaint], { nullable: true })
  @OneToMany(() => Complaint, (complaint) => complaint.complainantAgency)
  complaintsFiled: Complaint[];

  @Field(() => [Complaint], { nullable: true })
  @OneToMany(() => Complaint, (complaint) => complaint.againstAgency)
  complaintsAgainst: Complaint[];



}
