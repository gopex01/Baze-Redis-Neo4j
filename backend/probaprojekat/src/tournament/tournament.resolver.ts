import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Tournament } from './tournament.entity';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisService } from 'src/redis-client/redis.service';
import { jwtConstants } from 'src/auth/constants';

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
  async vratiMojeTurnire(auth: string) {
    return await this.neo4jService.vratiMojeTurnire(auth);
  }
  @Query(() => Tournament)
  async addTournament(input: Tournament, token: string) {
    await this.neo4jService.addTournament(
      input.naziv,
      input.datumOdrzavanja,
      input.mestoOdrzavanja,
      input.maxBrojTimova,
      input.trenutniBrojTimova,
      input.nagrada,
      token,
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
    pretragaNaziv: string,
    pretragaMesto: string,
    pretragaPocetniDatum: string,
    pretragaKrajnjiDatum: string,
    pretragaPocetnaNagrada: number,
    pretragaKrajnjaNagrada: number,
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
  @Query(()=>Tournament)
  async searchTournament(name:string)
  {
    const cachedData=await this.redisService.getClient().get(name);
    if(cachedData)
    {
      console.log('Data from cache ',cachedData);
      return JSON.parse(cachedData);
    }
    const data=await this.neo4jService.getTournament(name);
    await this.redisService.getClient().set(name,JSON.stringify(data),'ex',30*15);
    console.log('Data set to redis cache', data);
    return data;
  }
  @Query(()=>Tournament)
  async getLastFiveTournaments()
  {
    const keys=await this.redisService.getFirstFiveKeys();
    const tournaments=await this.redisService.getValuesOfKeys(keys);
    return tournaments;
  }
  @Query(() => Tournament)
  async getAllPlayersOnTournament(tournamentName: string) {
    return this.neo4jService.getAllPlayersOnTournament(tournamentName);
  }
}
