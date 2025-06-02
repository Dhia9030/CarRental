import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from './message.entity';

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @ManyToOne(() => User)
    @JoinColumn()
    admin: User;

    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: true })
    isActive: boolean;
}