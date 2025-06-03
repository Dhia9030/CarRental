import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { User } from '../auth/decorators/auth.decorators';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) { }


    @Get('conversations/user')
    async getUserConversations(@User() user) {
        return this.chatService.getUserConversations(user.id);
    }

    @Get('conversations/admin')
    async getAdminConversations(@User() user) {
        return this.chatService.getAdminConversations(user.id);
    }

    @Get('messages')
    async getMessages(
        @Query('conversationId') conversationId: number,
        @User() user
    ) {
        const conversation = await this.chatService.verifyConversationAccess(
            conversationId,
            user.id,user.role
        );
        if (!conversation) {
            throw new Error('Access denied or conversation not found');
        }

        return this.chatService.getMessages(conversationId);
    }
}