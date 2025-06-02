import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

interface ClientInfo {
    socket: Socket;
    userId: number;
    role: 'admin' | 'user';
}

@Injectable()
export class ChatService {
    private clients = new Map<string, ClientInfo>();
    private activeChats = new Map<number, number>(); // userId -> adminId

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    async registerClient(client: Socket, token: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userService.findById(payload.sub);

            if (!user) throw new UnauthorizedException();

            this.clients.set(client.id, {
                socket: client,
                userId: user.id,
                role: user.role,
            });

            console.log(`User ${user.id} connected as ${user.role}`);
        } catch (err) {
            client.disconnect();
        }
    }

    removeClient(client: Socket) {
        this.clients.delete(client.id);
    }

    assignAdminToUser(client: Socket) {
        const clientInfo = this.clients.get(client.id);
        if (!clientInfo || clientInfo.role !== 'user') return;

        const availableAdminEntry = [...this.clients.entries()].find(
            ([_, info]) => info.role === 'admin' && ![...this.activeChats.values()].includes(info.userId),
        );

        if (!availableAdminEntry) {
            client.emit('noAdminsAvailable');
            return;
        }

        const [adminSocketId, adminInfo] = availableAdminEntry;
        this.activeChats.set(clientInfo.userId, adminInfo.userId);

        client.emit('matched', { adminId: adminInfo.userId });
        adminInfo.socket.emit('matched', { userId: clientInfo.userId });
    }

    handleMessage(senderSocket: Socket, content: string) {
        const senderInfo = this.clients.get(senderSocket.id);
        if (!senderInfo) return;

        const recipientId =
            senderInfo.role === 'user'
                ? this.activeChats.get(senderInfo.userId)
                : [...this.activeChats.entries()].find(([, adminId]) => adminId === senderInfo.userId)?.[0];

        if (!recipientId) return;

        const recipientSocketEntry = [...this.clients.entries()].find(
            ([_, info]) => info.userId === recipientId,
        );

        if (recipientSocketEntry) {
            const [_, recipientInfo] = recipientSocketEntry;
            recipientInfo.socket.emit('receiveMessage', {
                from: senderInfo.userId,
                content,
            });
        }
    }
}
