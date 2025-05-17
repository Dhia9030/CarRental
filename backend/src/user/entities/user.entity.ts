import { Booking } from 'src/booking/entities/booking.entity';
import { Review } from 'src/review/entities/review.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../enums/role.enum';
@Entity()
@Unique(['email'])
export class User {

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Booking, booking => booking.user)
    bookings: Booking[];

}
