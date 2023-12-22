import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RedisService } from 'src/redis-client/redis.service';

@Module({
  imports: [],
  providers: [MessageService, RedisService],
  controllers: [MessageController],
})
export class MessageModule {}
