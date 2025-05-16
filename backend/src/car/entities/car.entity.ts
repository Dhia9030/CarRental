import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FuelType } from '../enums/fuel-type.enum';
import { Agency } from 'src/agency/entities/agency.entity';

@Entity()
export class Car {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    model: string;

    @Column({ type: 'varchar', length: 100 })
    company: string;

    @Column({ type: 'int' })
    year: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    pricePerDay: number;

    @Column({
        type: 'enum',
        enum: FuelType,
    })
    fuelType: FuelType;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 200 })
    location: string;

    @Column({ type: 'int' })
    seat: number;

    @ManyToOne(() => Agency, { eager: true })
    @JoinColumn({ name: 'agencyId' })
    agency: Agency;

}
