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
import {User as U} from '../auth/decorators/auth.decorators'


@WebSocketGateway(3005,{ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server; // Socket.io server instance

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  // Handle initial connection and enforce JWT authentication
  async handleConnection(client: Socket) {
    try {
        console.log("ay haja");
      const token = client.handshake.headers.authorization?.split(' ')[1] || '';

      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.userId);
      // If user not found or role is not allowed (e.g., agency), disconnect
      if (!user || !['admin','user'].includes(user.role)) {
        throw new Error('Unauthorized');
      }
      // Attach user info to socket for later use
      (client as any).user = user;
    } catch (err) {
      client.disconnect(true);
    }
  }

  // Example event: user joins a conversation room
//   @UseGuards(WsJwtGuard) // Custom guard to validate JWT on websocket events
  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @U() user,
    @MessageBody() payload: { conversationId: number },
  ) {
    const conv = await this.chatService.getConversation(payload.conversationId);
    if (!conv) {
      client.emit('error', 'Conversation not found');
      return;
    }
    // Ensure only the assigned user or admin can join
    if (
      (user.role === 'user'  && conv.user.id !== user.userId) ||
      (user.role === 'admin' && conv.admin.id !== user.userId)
    ) {
      client.emit('error', 'Not authorized to join this conversation');
      return;
    }
    client.join(`conversation_${conv.id}`);
    client.emit('joinedConversation', { conversationId: conv.id });
  }

  // Event: sending a new message
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @U() user: { userId: number, role: string },
    @MessageBody() dto: { conversationId: number, content: string },
  ) {
    const msg = await this.chatService.sendMessage(dto.conversationId, user.userId, dto.content);
    // Broadcast the new message to all clients in the room
    this.server.to(`conversation_${dto.conversationId}`).emit('newMessage', msg);
  }

  // Event: marking messages as read
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('readMessages')
  async handleReadMessages(
    @U() user: { userId: number, role: string },
    @MessageBody() dto: { conversationId: number, messageIds: number[] },
  ) {
    await this.chatService.markMessagesAsRead(dto.conversationId, user.userId, dto.messageIds);
    // Notify other party that messages have been read
    this.server.to(`conversation_${dto.conversationId}`).emit('messagesRead', {
      conversationId: dto.conversationId,
      messageIds: dto.messageIds,
      readerId: user.userId,
    });
  }

  async handleDisconnect(client: Socket) {
    // Optionally handle cleanup or user offline status
  }
}
