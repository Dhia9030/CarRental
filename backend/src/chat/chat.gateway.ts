import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly chatService: ChatService) { }

    async handleConnection(client: Socket) {
        const token = client.handshake.auth.token;
        await this.chatService.registerClient(client, token);
    }

    handleDisconnect(client: Socket) {
        this.chatService.removeClient(client);
    }

    @SubscribeMessage('requestSupport')
    handleSupportRequest(@ConnectedSocket() client: Socket) {
        this.chatService.assignAdminToUser(client);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { content: string },
    ) {
        this.chatService.handleMessage(client, payload.content);
    }
}