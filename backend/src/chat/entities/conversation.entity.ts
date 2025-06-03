import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from './message.entity';
// conversation.entity.ts
@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  // The user who participates in this conversation
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // The admin assigned to this conversation
  @ManyToOne(() => User)
  @JoinColumn({ name: 'adminId' })
  admin: User;

  @OneToMany(() => Message, msg => msg.conversation, { cascade: true })
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
