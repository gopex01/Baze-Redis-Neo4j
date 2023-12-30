import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { IgracResolver } from './player.resolver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { MessageService } from 'src/message/message.service';
import { RedisService } from 'src/redis-client/redis.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [],
  providers: [
    IgracResolver,
    Neo4jService,
    MessageService,
    RedisService,
    JwtStrategy,
    JwtService,
  ],
  controllers: [PlayerController],
})
export class PlayerModule {}
