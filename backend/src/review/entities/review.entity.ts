import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Car } from '../../car/entities/car.entity';
import { TimestampEntity } from 'src/Generics/timestamp.entity';

@Entity()
export class Review extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Car, { eager: true })
  @JoinColumn({ name: 'carId' })
  car: Car;

  @Column()
  value: number;

  @Column({ type: 'text', nullable: true })
  description: string;
}