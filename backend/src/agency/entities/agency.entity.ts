import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { TimestampEntity } from 'src/Generics/timestamp.entity';
import {Field, Int, ObjectType} from '@nestjs/graphql'

@ObjectType()
@Entity()
export class Agency extends TimestampEntity {

    @Field(()=>Int)
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

    @Field(()=>[Car])
    @OneToMany(() => Car, car => car.agency)
    cars: Car[];


}
