import { Module } from '@nestjs/common';

import { RedisService } from 'src/redis-client/redis.service';
import { RegistrationController } from './registration.controller';
import { RegistrationResolver } from './registration.resolver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { MessageService } from 'src/message/message.service';
import { IgracResolver } from 'src/player/player.resolver';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [
    RedisService,
    RegistrationResolver,
    Neo4jService,
    MessageService,
    IgracResolver,
    JwtService,
  ],
  controllers: [RegistrationController],
})
export class RegistrationModule {}
