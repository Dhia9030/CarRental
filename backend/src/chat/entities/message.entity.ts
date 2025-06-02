import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => User)
    @JoinColumn()
    sender: User;

    @ManyToOne(() => Conversation, conversation => conversation.messages)
    conversation: Conversation;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    isRead: boolean;
}