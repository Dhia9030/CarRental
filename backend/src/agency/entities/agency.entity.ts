import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { TimestampEntity } from 'src/Generics/timestamp.entity';

@Entity()
export class Agency extends TimestampEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,  // enough for most hash formats 
        nullable: false,
        select: false  // do not select password by default
    })
    password: string;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    username: string;

    @OneToMany(() => Car, car => car.agency)
    cars: Car[];


}
