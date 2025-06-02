import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
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
            await this.conversationRepository.save(conversation);
        }

        return conversation;
    }

    async getUserConversations(userId: number): Promise<Conversation[]> {
        return this.conversationRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'admin'],
        });
    }

    async getAdminConversations(adminId: number): Promise<Conversation[]> {
        return this.conversationRepository.find({
            where: { admin: { id: adminId } },
            relations: ['user', 'admin'],
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