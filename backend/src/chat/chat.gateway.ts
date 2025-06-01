import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

interface ChatMessage {
    senderId: number;
    receiverId: number;
    content: string;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private clients = new Map<number, Socket>();
    handleConnection(client: Socket) {
        const userId = Number(client.handshake.query.userId);
        console.log('Connection attempt from userId:', userId);
        if (!userId || isNaN(userId)) {
            client.disconnect();
            console.log('Disconnected due to invalid userId');
            return;
        }

        this.clients.set(userId, client);
        console.log(`User ${userId} connected`);
    }


    handleDisconnect(client: Socket) {
        const userId = Number(client.handshake.query.userId);
        this.clients.delete(userId);
        console.log(`User ${userId} disconnected`);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(
        @MessageBody() message: ChatMessage,
        @ConnectedSocket() senderSocket: Socket,
    ) {
        console.log('Message received:', message);
        const receiverSocket = this.clients.get(message.receiverId);
        if (receiverSocket) {
            receiverSocket.emit('receiveMessage', message);
        }
    }
}
