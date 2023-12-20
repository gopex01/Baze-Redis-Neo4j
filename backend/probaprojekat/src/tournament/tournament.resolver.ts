import { Query, Resolver } from '@nestjs/graphql';
import { Tournament } from './tournament.entity';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Resolver(() => Tournament)
export class TournamentResolver {
  constructor(private readonly neo4jService: Neo4jService) {}
  @Query(() => Tournament)
  async addTournament(input: Tournament) {
    await this.neo4jService.addTournament(
      input.Name,
      input.Date,
      input.Place,
      input.NumberOfTeamsMax,
      input.NumberOfTeamsNow,
      input.Price,
    );
    return {
      message: 'success',
    };
  }
}
