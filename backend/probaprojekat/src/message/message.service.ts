import { RedisService } from 'src/redis-client/redis.service';
import { MessageEntity } from './message.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  constructor(private readonly redisService: RedisService) {}
  async createMessage(newMessage: MessageEntity) {
    const message = new MessageEntity(
      newMessage.messageText,
      newMessage.time,
      newMessage.status,
      newMessage.playerId,
      newMessage.tournamentId,
    );
    const key = `message:${message.id}`;
    await this.redisService.set(key, JSON.stringify(newMessage));
  }
  async getMessage(iD: string) {
    const key = `message:${iD}`;
    const data = await this.redisService.get(key);
    return data ? JSON.parse(data) : null;
  }
}