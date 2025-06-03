import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsJwtGuard } from '../auth/ws-jwt.guard';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from 'src/user/enums/role.enum';
import { UserService } from '../user/user.service';

@WebSocketGateway(3005, {
    cors: {
        origin: ['*'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket'],
})
@UseGuards(WsJwtGuard) // Use our custom WebSocket guard
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatService: ChatService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async handleConnection(client: Socket & { user: User }) {
        console.log(`Client connected: ${client.id}`);

        if (client.user.role === UserRole.ADMIN) {
            client.join('admins');
            console.log(`Admin ${client.user.id} connected`);
        } else {
            client.join(`user_${client.user.id}`);
            console.log(`User ${client.user.id} connected`);
        }
    }

    handleDisconnect(client: Socket & { user: User }) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() client: Socket & { user: User },
        @MessageBody() createMessageDto: CreateMessageDto,
    ) {
        const sender = client.user;
        let conversationId = createMessageDto.conversationId;

        // If new conversation, find an admin
        if (!conversationId) {
            const admin = await this.chatService.findAvailableAdmin();
            if (!admin) {
                throw new Error('No available admin');
            }

            const conversation = await this.chatService.findOrCreateConversation(
                sender.id,
                admin.id
            );
            conversationId = conversation.id;

            // Notify admin about new conversation
            this.server.to(`admin_${admin.id}`).emit('newConversation', conversation);
        }

        const message = await this.chatService.createMessage(
            { ...createMessageDto, conversationId },
            sender
        );

        // Emit to conversation room
        this.server.to(`conversation_${conversationId}`).emit('newMessage', message);

        return { message, conversationId };
    }

    @SubscribeMessage('joinConversation')
    async handleJoinConversation(
        @ConnectedSocket() client: Socket & { user: User },
        @MessageBody() conversationId: number,
    ) {
        const conversation = await this.chatService.getConversation(conversationId);

        // Verify user is part of conversation
        if (client.user.id !== conversation.user.id &&
            client.user.id !== conversation.admin.id) {
            throw new Error('Unauthorized access to conversation');
        }

        client.join(`conversation_${conversationId}`);
        await this.chatService.markMessagesAsRead(conversationId, client.user.id);

        // Send conversation history
        const messages = await this.chatService.getMessages(conversationId);
        return messages;
    }
}