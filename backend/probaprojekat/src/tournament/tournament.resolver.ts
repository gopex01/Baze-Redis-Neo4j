import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Tournament } from './tournament.entity';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Resolver(() => Tournament)
export class TournamentResolver {
  constructor(private readonly neo4jService: Neo4jService) {}
  @Query(() => Tournament)
  async allTournaments() {
    return await this.neo4jService.allTournaments();
  }
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
  @Query(() => Tournament)
  async filterTournaments(
    pretragaNaziv: string | undefined,
    pretragaMesto: string | undefined,
    pretragaPocetniDatum: string | undefined,
    pretragaKrajnjiDatum: string | undefined,
    pretragaPocetnaNagrada: number | undefined,
    pretragaKrajnjaNagrada: number | undefined,
  ) {
    return await this.neo4jService.filterTournaments(
      pretragaNaziv,
      pretragaMesto,
      pretragaPocetniDatum,
      pretragaKrajnjiDatum,
      pretragaPocetnaNagrada,
      pretragaKrajnjaNagrada,
    );
  }
  @Query(()=>Tournament)
  async getOneTournament(name:string)
  {
    return await this.neo4jService.getTournament(name);
  }
}
