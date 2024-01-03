import { Module } from '@nestjs/common';
import { OrganizatorController } from './organizator.controller';
import { OrganizatorResolver } from './organizator.resolver';
import { RedisService } from 'src/redis-client/redis.service';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { MessageService } from 'src/message/message.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [
    OrganizatorResolver,
    Neo4jService,
    RedisService,
    MessageService,
    JwtService,
  ],
  controllers: [OrganizatorController],
})
export class OrganizatorModule {}
