import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { ChatController } from './chat.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, Conversation, User]),
        UserModule,
        AuthModule,
        JwtModule.register({}), // Register JWT module for authentication
    ],
    providers: [ChatGateway, ChatService],
    controllers: [ChatController],
    exports: [ChatService],
})
export class ChatModule { }