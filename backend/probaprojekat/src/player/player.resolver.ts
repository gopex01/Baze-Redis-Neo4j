import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Player } from './player.entity';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Body } from '@nestjs/common';
@Resolver(() => Player)
export class IgracResolver {
  constructor(private readonly neo4jService: Neo4jService) {}
  @Query(() => Player)
  async addPlayer(input: Player) {
    console.log('front je povezan');
    await this.neo4jService.savePlayer(
      input.korisnickoIme,
      input.lozinka,
      input.ime,
      input.prezime,
      input.vodjaTima,
    );
    return {
      message: 'success',
    };
  }
  @Query(() => Player)
  async getAllPlayers() {
    return await this.neo4jService.getAllPlayers();
  }
  @Query(() => Player)
  async getOnePlayer(username: string) {
    return await this.neo4jService.getOnePlayer(username);
  }
  // @Query(() => Player)
  // async findOne(username: string) {
  //   return await this.neo4jService.findOne(username);
  // }
  @Query(() => Player)
  async getPlayersWithSimilarUsername(username: string) {
    return await this.neo4jService.getPlayersWithSimilarUsername(username);
  }
  @Query(() => Player)
  async changePlayerData(idPlayer: string, newPlayer: Player) {
    return await this.neo4jService.changePlayerData(idPlayer, newPlayer);
  }
  @Query(() => Player)
  async getPlayerById(playerId: string) {
    return await this.neo4jService.getPlayerById(playerId);
  }
  // @Query(() => Player)
  // async registerPlayerForTournament(
  //   playerUsername: string,
  //   tournamentId: string,
  // ) {
  //   return await this.neo4jService.registerPlayerForTournament(
  //     playerUsername,
  //     tournamentId,
  //   );
  // }
  @Query(() => Player)
  async getPlayerTournaments(playerUsername: string) {
    return await this.neo4jService.getPlayerTournaments(playerUsername);
  }
  @Query(() => Player)
  async getTeammates(turnirId: string, igracId: string) {
    return await this.neo4jService.getTeammates(turnirId, igracId);
  }
  @Query(() => Player)
  async vratiMoguceSaigrace(igracId: string) {
    return await this.neo4jService.vratiMoguceSaigrace(igracId);
  }
  @Query(() => Player)
  async isPlayerRegisteredForTournament(
    tournamentId: string,
    playerId: string,
  ) {
    return await this.neo4jService.isPlayerRegisteredForTournament(
      tournamentId,
      playerId,
    );
  }
}
