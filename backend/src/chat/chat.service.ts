import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from 'src/user/enums/role.enum';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private convRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private msgRepo: Repository<Message>,
    // @InjectRepository(User) private userRepo: Repository<User>, // if needed
  ) {}

  // Retrieve a conversation by ID (or create one if desired)
  async getConversation(conversationId: number): Promise<Conversation | null> {
    return (this.convRepo.findOne({
          where: { id: conversationId },
  relations: ['user', 'admin', 'messages'],
  }));
  }

  // (Optional) Find or create a conversation between a given user and admin
  async findOrCreateConversation(userId: number, adminId: number): Promise<Conversation> {
    let conv = await this.convRepo.findOne({
      where: { user: { id: userId }, admin: { id: adminId } },
      relations: ['user','admin','messages'],
    });
    if (!conv) {
      conv = this.convRepo.create({ user: { id: userId } as User, admin: { id: adminId } as User });
      conv = await this.convRepo.save(conv);
    }
    return conv;
  }

  // Persist a new message and return it
  async sendMessage(conversationId: number, senderId: number, content: string): Promise<Message> {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');
    const message = this.msgRepo.create({
      conversation: { id: conversationId } as Conversation,
      sender: { id: senderId } as User,
      content,
    });
    return this.msgRepo.save(message);
  }

  // Mark given messages as read by the user
  async markMessagesAsRead(conversationId: number, readerId: number, messageIds: number[]): Promise<void> {
    await this.msgRepo
      .createQueryBuilder()
      .update(Message)
      .set({ read: true })
      .where('id IN (:...ids)', { ids: messageIds })
      .andWhere('conversationId = :convId', { convId: conversationId })
      .execute();
  }

  // Retrieve all messages in a conversation (optionally with pagination)
  async getMessages(conversationId: number): Promise<Message[]> {
    return this.msgRepo.find({ where: { conversation: { id: conversationId } }, order: { createdAt: 'ASC' } });
  }
  // Assuming you have a Conversation entity and repo injected
async getUserConversations(userId: number): Promise<Conversation[]> {
  return this.convRepo.find({
    where: { user: { id: userId } },
    relations: ['admin', 'messages']
  });
}

async getAdminConversations(adminId: number): Promise<Conversation[]> {
  return this.convRepo.find({
    where: { admin: { id: adminId } },
    relations: ['user', 'messages']
  });
}

async verifyConversationAccess(conversationId: number, userId: number, role: UserRole): Promise<Conversation> {
  const conversation = await this.convRepo.findOne({
    where: { id: conversationId },
    relations: ['user', 'admin']
  });

  if (!conversation) throw new Error('Conversation not found');

  const allowed =
    (role === UserRole.USER && conversation.user.id === userId) ||
    (role === UserRole.ADMIN && conversation.admin?.id === userId);

  if (!allowed) throw new Error('Forbidden');

  return conversation;
}

}
