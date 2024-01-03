import { Module } from '@nestjs/common';
import { IgracResolver } from 'src/player/player.resolver';
import { TournamentResolver } from './tournament.resolver';
import { TournamentController } from './tournament.controller';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from 'src/redis-client/redis.service';
import { MessageService } from 'src/message/message.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CacheModule.register()],
  providers: [
    TournamentResolver,
    Neo4jService,
    RedisService,
    MessageService,
    JwtService,
  ],
  controllers: [TournamentController],
})
export class TournamentModule {}
