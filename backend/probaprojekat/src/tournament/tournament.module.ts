import { Module } from '@nestjs/common';
import { IgracResolver } from 'src/player/player.resolver';
import { TournamentResolver } from './tournament.resolver';
import { TournamentController } from './tournament.controller';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from 'src/redis-client/redis.service';

@Module({
  imports: [CacheModule.register()],
  providers: [TournamentResolver, Neo4jService,RedisService],
  controllers: [TournamentController],
})
export class TournamentModule {}
