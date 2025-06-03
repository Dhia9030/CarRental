import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from 'src/user/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@WebSocketGateway(3005, {
    cors: {
        origin: '*', // Allow all origins (adjust for production)
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket'],
})

@Roles(Role.ADMIN, Role.USER)
@UseGuards(JwtAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) { }

    async handleConnection(client: Socket & { user: User }) {
        console.log(`Client connected: ${client.id}`);

        if (client.user.role === UserRole.ADMIN) {
            client.join('admins');
        } else {
            client.join(`user_${client.user.id}`);
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() client: Socket & { user: User },
        @MessageBody() createMessageDto: CreateMessageDto,
    ) {
        const sender = client.user;
        const message = await this.chatService.createMessage(createMessageDto, sender);

        const conversation = await this.chatService.findOrCreateConversation(
            sender.id,
            await this.findAvailableAdmin()
        );

        this.server.to(`conversation_${conversation.id}`).emit('newMessage', message);

        if (sender.role === UserRole.ADMIN) {
            this.server.to(`user_${conversation.user.id}`).emit('newMessage', message);
        } else {
            this.server.to('admins').emit('newMessage', message);
        }

        return message;
    }

    @SubscribeMessage('joinConversation')
    async handleJoinConversation(
        @ConnectedSocket() client: Socket & { user: User },
        @MessageBody() conversationId: number,
    ) {
        client.join(`conversation_${conversationId}`);
        await this.chatService.markMessagesAsRead(conversationId, client.user.id);
    }

    private async findAvailableAdmin(): Promise<number> {
        return 1;
    }
}