import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Registration } from './registration.entity';
import { Body, Param } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(() => Registration)
export class RegistrationResolver {
  constructor(private readonly neo4jService: Neo4jService) {}
  @Query(() => Registration)
  async getRegistration(registrationId: string) {
    return this.neo4jService.getRegistration(registrationId);
  }
  @Query(() => Registration)
  async createRegistration(newRegistration: Registration) {
    return await this.neo4jService.createRegistration(newRegistration);
  }
  @Query(() => Registration)
  async allRegistrationsForTournament(tournamentId: string) {
    return await this.neo4jService.allRegistrationsForTournament(tournamentId);
  }
  //ovo je brisanje prijave
  @Query(() => Registration)
  async removeTeamFromTournament(registrationId: string) {
    return await this.neo4jService.removeTeamFromTournament(registrationId);
  }
  @Query(() => Registration)
  async vratiPrijavuPoId(registrationId: string) {
    return await this.neo4jService.vratiPrijavuPoId(registrationId);
  }
  @Query(() => Registration)
  async odjaviSvojTimSaTurnira(turniraId: string, igracId: string) {
    return await this.neo4jService.odjaviSvojTimSaTurnira(turniraId, igracId);
  }
}
