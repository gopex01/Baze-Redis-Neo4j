import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Tournament } from './tournament.entity';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisService } from 'src/redis-client/redis.service';

@Resolver(() => Tournament)
export class TournamentResolver {
  constructor(
    private readonly neo4jService: Neo4jService,
    //@Inject(CACHE_MANAGER) private cacheService:Cache)
    private readonly redisService: RedisService,
  ) {}
  @Query(() => Tournament)
  async allTournaments() {
    return await this.neo4jService.allTournaments();
  }
  @Query(() => Tournament)
  async addTournament(input: Tournament) {
    await this.neo4jService.addTournament(
      input.name,
      input.date,
      input.place,
      input.numberOfTeamsMax,
      input.numberOfTeamsNow,
      input.price,
    );
    return {
      message: 'success',
    };
  }
  @Query(() => Tournament)
  async deleteTournament(tournamentId: string) {
    return this.neo4jService.deleteTournament(tournamentId);
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
  @Query(() => Tournament)
  async getTournamentById(tournamentId: string) {
    const cachedData = await this.redisService.getClient().get(tournamentId);

    if (cachedData) {
      console.log('DATA FROM CACHE   ', cachedData);
      return JSON.parse(cachedData);
    }

    const data = await this.neo4jService.getTournamentById(tournamentId);

    // Postavljanje vrednosti u keš sa vremenom života od 30 sekundi
    await this.redisService
      .getClient()
      .set(tournamentId, JSON.stringify(data), 'ex', 30);

    console.log('Data set to Redis cache', data);
    return data;
    /*const cachedData=await this.cacheService.get(tournamentId);
    if(cachedData)
    {
      console.log("DATA FROM CACHE   ",cachedData);
      return cachedData;
    }
    const data=await this.neo4jService.getTournamentById(tournamentId);
    await this.cacheService.set(tournamentId,data);
    console.log('Data set to cache',data);
    return await data;*/
  }
  @Query(() => Tournament)
  async getOneTournament(name: string) {
    const cachedData = await this.redisService.getClient().get(name);

    if (cachedData) {
      console.log('DATA FROM CACHE   ', cachedData);
      return JSON.parse(cachedData);
    }

    const data = await this.neo4jService.getTournament(name);

    // Postavljanje vrednosti u keš sa vremenom života od 30 sekundi
    await this.redisService
      .getClient()
      .set(name, JSON.stringify(data), 'ex', 30);

    console.log('Data set to Redis cache', data);
    return data;
  }
  @Query(() => Tournament)
  async getAllPlayersOnTournament(tournamentName: string) {
    return this.neo4jService.getAllPlayersOnTournament(tournamentName);
  }
}
