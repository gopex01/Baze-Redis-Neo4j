import { RedisService } from 'src/redis-client/redis.service';
import { MessageEntity } from './message.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  constructor(private readonly redisService: RedisService) {}
  async createMessage(newMessage: MessageEntity) {
    const message = new MessageEntity(newMessage.messageText, newMessage.time);
    const key = `message:${newMessage.playerId}:${newMessage.id}`;
    await this.redisService.set(key, JSON.stringify(newMessage), 20 * 60); //5 min po 60s
  }
  async getMessage(iD: string) {
    const key = `message:${iD}`;
    const data = await this.redisService.get(key);
    return data ? JSON.parse(data) : null;
  }
  async getMessagesforPlayer(playerID: string) {
    const key = `message:${playerID}:*`;
    const keys = await this.redisService.getKeys(key);
    const data = await this.redisService.getValuesOfKeys(keys);
    if (data) {
      return data.map((p) => JSON.parse(p));
    }
    return [];
  }
}
