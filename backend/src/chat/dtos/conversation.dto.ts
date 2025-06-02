import { User } from '../../user/entities/user.entity';

export class ConversationDto {
    id: number;
    user: User;
    admin: User;
    createdAt: Date;
    isActive: boolean;
}