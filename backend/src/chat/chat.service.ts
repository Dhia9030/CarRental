import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from 'src/user/enums/role.enum';

@Injectable()
export class ChatService {
    verifyConversationAccess(conversationId: number, id: any) {
        return this.conversationRepository.findOne({
            where: {
                id: conversationId,
                isActive: true,
                user: { id },
            },
            relations: ['user', 'admin'],
        }).then(conversation => {
            if (!conversation) {
                throw new Error('Access denied or conversation not found');
            }
            return conversation;
        });
    }
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createMessage(createMessageDto: CreateMessageDto, sender: User): Promise<Message> {
        const { content, conversationId } = createMessageDto;

        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId },
            relations: ['user', 'admin'],
        });

        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const message = this.messageRepository.create({
            content,
            sender,
            conversation,
        });

        return this.messageRepository.save(message);
    }

    async getMessages(conversationId: number): Promise<Message[]> {
        return this.messageRepository.find({
            where: { conversation: { id: conversationId } },
            relations: ['sender'],
            order: { createdAt: 'ASC' },
        });
    }

    async findOrCreateConversation(userId: number, adminId: number): Promise<Conversation> {
        let conversation = await this.conversationRepository.findOne({
            where: {
                user: { id: userId },
                admin: { id: adminId },
                isActive: true
            },
            relations: ['user', 'admin'],
        });

        if (!conversation) {
            conversation = this.conversationRepository.create({
                user: { id: userId },
                admin: { id: adminId },
            });
            conversation = await this.conversationRepository.save(conversation);
        }

        return conversation;
    }

    async getConversation(id: number): Promise<Conversation> {
        const conversation = await this.conversationRepository.findOne({
            where: { id },
            relations: ['user', 'admin'],
        });
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        return conversation;
    }

    async findAvailableAdmin(): Promise<User> {
        const admin = await this.userRepository.findOne({
            where: { role: UserRole.ADMIN },
        });
        if (!admin) {
            throw new Error('No admin user found');
        }
        return admin;
    }

    async getUserConversations(userId: number): Promise<Conversation[]> {
        return this.conversationRepository.find({
            where: { user: { id: userId }, isActive: true },
            relations: ['user', 'admin', 'messages'],
            order: { createdAt: 'DESC' },
        });
    }

    async getAdminConversations(adminId: number): Promise<Conversation[]> {
        return this.conversationRepository.find({
            where: { admin: { id: adminId }, isActive: true },
            relations: ['user', 'admin', 'messages'],
            order: { createdAt: 'DESC' },
        });
    }

    async markMessagesAsRead(conversationId: number, userId: number): Promise<void> {
        await this.messageRepository
            .createQueryBuilder()
            .update(Message)
            .set({ isRead: true })
            .where('conversationId = :conversationId', { conversationId })
            .andWhere('senderId != :userId', { userId })
            .execute();
    }
}