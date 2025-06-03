// MOCK USER ENTITY TO AVOID DEPENDENCIES
jest.mock('../user/entities/user.entity', () => {
    class MockUser {
        id: number;
        role: string;
    }
    return MockUser;
});

import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from './dtos/create-message.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from 'src/user/enums/role.enum';

describe('ChatGateway', () => {
    let gateway: ChatGateway;
    let chatService: ChatService;
    let server: Server;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChatGateway,
                {
                    provide: ChatService,
                    useValue: {
                        findAvailableAdmin: jest.fn().mockResolvedValue({ id: 1, role: UserRole.ADMIN }),
                        findOrCreateConversation: jest.fn().mockResolvedValue({ id: 1 }),
                        createMessage: jest.fn().mockResolvedValue({ id: 1, content: 'Test' }),
                        getConversation: jest.fn().mockResolvedValue({
                            id: 1,
                            user: { id: 1 },
                            admin: { id: 2 }
                        }),
                        getMessages: jest.fn().mockResolvedValue([]),
                        markMessagesAsRead: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        // Add any required user service methods here
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        // Mock JWT methods if needed
                    },
                },
            ],
        }).compile();

        gateway = module.get<ChatGateway>(ChatGateway);
        chatService = module.get<ChatService>(ChatService);

        // Mock WebSocket server
        gateway.server = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        } as any;
        server = gateway.server;
    });

    describe('handleConnection', () => {
        it('should join admin room for admin users', () => {
            const client = {
                join: jest.fn(),
                user: { role: UserRole.ADMIN, id: 1 }
            } as any;

            gateway.handleConnection(client);
            expect(client.join).toHaveBeenCalledWith('admins');
        });

        it('should join user room for regular users', () => {
            const client = {
                join: jest.fn(),
                user: { role: UserRole.USER, id: 2 }
            } as any;

            gateway.handleConnection(client);
            expect(client.join).toHaveBeenCalledWith('user_2');
        });
    });

    describe('handleMessage', () => {
        it('should create new conversation when none exists', async () => {
            const client = { user: { id: 1 } } as any;
            const dto: CreateMessageDto = { content: 'Hello', conversationId: 3 };

            await gateway.handleMessage(client, dto);

            expect(chatService.findAvailableAdmin).toHaveBeenCalled();
            expect(chatService.findOrCreateConversation).toHaveBeenCalledWith(1, 1);
            expect(server.emit).toHaveBeenCalledWith('newMessage', expect.anything());
        });
    });

    describe('joinConversation', () => {
        it('should join conversation and mark messages read', async () => {
            const client = {
                join: jest.fn(),
                user: { id: 1 }
            } as any;

            await gateway.handleJoinConversation(client, 1);

            expect(client.join).toHaveBeenCalledWith('conversation_1');
            expect(chatService.markMessagesAsRead).toHaveBeenCalledWith(1, 1);
        });
    });
});