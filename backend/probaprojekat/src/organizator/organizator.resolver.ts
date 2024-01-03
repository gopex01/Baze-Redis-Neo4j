import { Body } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Organizator } from './organizator.entity';
import { Request } from '@nestjs/common';
@Resolver(() => Organizator)
export class OrganizatorResolver {
  constructor(private readonly neo4jService: Neo4jService) {}
  @Query(() => Organizator)
  async findOneOrganizator(username: string) {
    return await this.neo4jService.findOneOrganizator(username);
  }
  @Query(() => Organizator)
  async registrujOrganizatora(organizator: Organizator) {
    return await this.neo4jService.registrujOrganizatora(organizator);
  }
  @Query(() => Organizator)
  async daLiJeOrganizatorTurnira(organizatorId: string, turnirId: string) {
    return await this.neo4jService.daLiJeOrganizatorTurnira(
      organizatorId,
      turnirId,
    );
  }
  @Query(() => Organizator)
  async changeOrganizatorData(
    organizatorId: string,
    newOrganizator: Organizator,
  ) {
    return await this.neo4jService.changeOrganizatorData(
      organizatorId,
      newOrganizator,
    );
  }
}
