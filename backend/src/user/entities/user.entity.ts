import { Booking } from 'src/booking/entities/booking.entity';
import { Review } from 'src/review/entities/review.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../enums/role.enum';
import { TimestampEntity } from 'src/Generics/timestamp.entity';
import { Exclude } from 'class-transformer';


@Entity()
@Unique(['email'])
export class User extends TimestampEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,  // enough for most hash formats 
        nullable: false,
        select: false  // do not select password by default
    })
    password: string;

    @Column()
    @Exclude()
    salt: string;


    @Column({ type: 'varchar', length: 100, nullable: false })
    firstName: string;


    @Column({ type: 'varchar', length: 100, nullable: false })
    lastName: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Booking, booking => booking.user)
    bookings: Booking[];

}
