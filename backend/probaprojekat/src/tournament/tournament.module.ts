import { Module } from '@nestjs/common';
import { IgracResolver } from 'src/player/player.resolver';
import { TournamentResolver } from './tournament.resolver';
import { TournamentController } from './tournament.controller';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Module({
  imports: [],
  providers: [TournamentResolver, Neo4jService],
  controllers: [TournamentController],
})
export class TournamentModule {}
