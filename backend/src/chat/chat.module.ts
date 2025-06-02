import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, Conversation]),
        UserModule,
        AuthModule,
    ],
    providers: [ChatGateway, ChatService],
    exports: [ChatService],
})
export class ChatModule { }