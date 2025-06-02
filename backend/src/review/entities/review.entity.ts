import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Car } from '../../car/entities/car.entity';
import { TimestampEntity } from 'src/Generics/timestamp.entity';
import {Field, Int, ObjectType} from '@nestjs/graphql'


@ObjectType()
@Entity()
export class Review extends TimestampEntity {
  
  @Field(()=>Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  carId: number;

  @Column({ nullable: false })
  userId: number;


  @Field(()=>User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(()=>Car)
  @ManyToOne(() => Car, { eager: true })
  @JoinColumn({ name: 'carId' })
  car: Car;

  @Field(()=>Int)
  @Column()
  value: number;

  @Field()
  @Column({ type: 'text', nullable: true })
  description: string;
}