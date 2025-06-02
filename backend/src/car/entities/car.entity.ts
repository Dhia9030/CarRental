import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { FuelType } from '../enums/fuel-type.enum';
import { Agency } from 'src/agency/entities/agency.entity';
import { Review } from 'src/review/entities/review.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { TimestampEntity } from 'src/Generics/timestamp.entity';
import {Field, Float, Int, ObjectType} from '@nestjs/graphql'

@ObjectType()
@Entity()
export class Car extends TimestampEntity {

    @Field(()=>Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ type: 'varchar', length: 100 })
    model: string;

    @Field()
    @Column({ type: 'varchar', length: 100 })
    company: string;

    @Field(()=>Int)
    @Column({ type: 'int' })
    year: number;

    @Field(()=>Float)
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    pricePerDay: number;

    @Field(()=>FuelType)
    @Column({
        type: 'enum',
        enum: FuelType,
    })
    fuelType: FuelType;

    @Field()
    @Column({ type: 'text', nullable: true })
    description?: string;

    @Field()
    @Column({ type: 'varchar', length: 200 })
    location: string;

    @Field(()=>Int)
    @Column({ type: 'int' })
    seat: number;

    @Field(()=>Int)
    @Column({ nullable: true })
    agencyId: number;

    @Field(()=>Agency)
    @ManyToOne(() => Agency, { eager: true })
    @JoinColumn({ name: 'agencyId' })
    agency: Agency;

    @Field(()=>[Review])
    @OneToMany(() => Review, review => review.car)
    reviews: Promise<Review[]>;

    @OneToMany(() => Booking, booking => booking.car)
    bookings: Booking[];

}
