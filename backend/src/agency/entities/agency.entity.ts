import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Car } from '../../car/entities/car.entity';

@Entity()
@Unique(['email'])
@Unique(['username'])
export class Agency {

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
    username: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Car, car => car.agency)
    cars: Car[];

}
