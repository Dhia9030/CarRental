// MOCK ALL EXTERNAL DEPENDENCIES
jest.mock('src/booking/entities/booking.entity', () => ({}));
jest.mock('src/review/entities/review.entity', () => ({}));

jest.mock('../user/entities/user.entity', () => {
    class MockUser {
        id: number;
        role: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
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
                        findAvailableAdmin: jest.fn().mockResolvedValue({
                            id: 1,
                            role: UserRole.ADMIN,
                            firstName: 'Admin',
                            lastName: 'User'
                        }),
                        findOrCreateConversation: jest.fn().mockResolvedValue({
                            id: 1,
                            user: { id: 1 },
                            admin: { id: 2 }
                        }),
                        createMessage: jest.fn().mockResolvedValue({
                            id: 1,
                            content: 'Test',
                            createdAt: new Date()
                        }),
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
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        verify: jest.fn(),
                    },
                },
            ],
        }).compile();

        gateway = module.get<ChatGateway>(ChatGateway);
        chatService = module.get<ChatService>(ChatService);

        // Create a more complete server mock
        gateway.server = {
            to: jest.fn().mockImplementation(() => ({
                emit: jest.fn(),
            })),
            emit: jest.fn(),
        } as unknown as Server;
        server = gateway.server;
    });

    describe('handleConnection', () => {
        it('should join admin room for admin users', () => {
            const client = {
                join: jest.fn(),
                user: {
                    id: 1,
                    role: UserRole.ADMIN,
                    firstName: 'Admin',
                    lastName: 'User'
                }
            } as unknown as Socket & { user: User };

            gateway.handleConnection(client);
            expect(client.join).toHaveBeenCalledWith('admins');
        });

        it('should join user room for regular users', () => {
            const client = {
                join: jest.fn(),
                user: {
                    id: 2,
                    role: UserRole.USER,
                    firstName: 'Regular',
                    lastName: 'User'
                }
            } as unknown as Socket & { user: User };

            gateway.handleConnection(client);
            expect(client.join).toHaveBeenCalledWith('user_2');
        });
    });

    describe('handleMessage', () => {
        it('should create new conversation when none exists', async () => {
            const client = {
                user: {
                    id: 1,
                    role: UserRole.USER
                }
            } as unknown as Socket & { user: User };

            const dto: CreateMessageDto = { content: 'Hello', conversationId: 3 };

            await gateway.handleMessage(client, dto);

            expect(chatService.findAvailableAdmin).toHaveBeenCalled();
            expect(chatService.findOrCreateConversation).toHaveBeenCalledWith(1, 1);
            expect(server.to).toHaveBeenCalledWith(`conversation_1`);
        });

        it('should use existing conversation when ID is provided', async () => {
            const client = {
                user: {
                    id: 1,
                    role: UserRole.USER
                }
            } as unknown as Socket & { user: User };

            const dto: CreateMessageDto = {
                content: 'Hello',
                conversationId: 5
            };

            await gateway.handleMessage(client, dto);

            expect(chatService.findAvailableAdmin).not.toHaveBeenCalled();
            expect(chatService.createMessage).toHaveBeenCalledWith(
                expect.objectContaining({ conversationId: 5 }),
                client.user
            );
        });
    });

    describe('handleJoinConversation', () => {
        it('should join conversation and mark messages read', async () => {
            const client = {
                join: jest.fn(),
                user: {
                    id: 1,
                    role: UserRole.USER
                }
            } as unknown as Socket & { user: User };

            await gateway.handleJoinConversation(client, 1);

            expect(client.join).toHaveBeenCalledWith('conversation_1');
            expect(chatService.markMessagesAsRead).toHaveBeenCalledWith(1, 1);
            expect(chatService.getMessages).toHaveBeenCalledWith(1);
        });

        it('should throw error for unauthorized access', async () => {
            const client = {
                join: jest.fn(),
                user: {
                    id: 99, // Not part of conversation
                    role: UserRole.USER
                }
            } as unknown as Socket & { user: User };

            // Simulate conversation with different users
            jest.spyOn(chatService, 'getConversation').mockResolvedValueOnce({
                id: 1,
                user: { id: 1 },
                admin: { id: 2 }
            } as any);

            await expect(gateway.handleJoinConversation(client, 1)).rejects.toThrow(
                'Unauthorized access to conversation'
            );
        });
    });
});