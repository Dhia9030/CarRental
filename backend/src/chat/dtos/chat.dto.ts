// chat.dto.ts

import { IsArray, IsInt, IsString } from "class-validator";

export class JoinConversationDto {
  @IsInt()
  conversationId: number;
}

export class SendMessageDto {
  @IsInt()
  conversationId: number;

  @IsString()
  content: string;
}

export class ReadMessagesDto {
  @IsInt()
  conversationId: number;

  @IsArray()
  @IsInt({ each: true })
  messageIds: number[];
}
