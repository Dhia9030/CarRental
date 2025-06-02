import { Booking } from 'src/booking/entities/booking.entity';
import { Review } from 'src/review/entities/review.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../enums/role.enum';
import { TimestampEntity } from 'src/Generics/timestamp.entity';
import { Exclude } from 'class-transformer';
import {Field, Int, ObjectType} from '@nestjs/graphql'

@ObjectType()
@Entity()
@Unique(['email'])
export class User extends TimestampEntity {

    @Field(()=>Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ type: 'varchar', length: 100, nullable: false })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,  // enough for most hash formats 
        nullable: false,
        select: false  // do not select password by default
    })
    password: string;

    @Field()
    @Column({ type: 'varchar', length: 100, nullable: false })
    firstName: string;

    @Field()
    @Column({ type: 'varchar', length: 100, nullable: false })
    lastName: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Field(()=>[Review])
    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Booking, booking => booking.user)
    bookings: Booking[];

}
