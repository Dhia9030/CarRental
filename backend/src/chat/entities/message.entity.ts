import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../../user/entities/user.entity';

// message.entity.ts
@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  // The conversation this message belongs to
  @ManyToOne(() => Conversation, conv => conv.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  // The user (or admin) who sent the message
  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  read: boolean;  // whether the recipient has read this message
}
