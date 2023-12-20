import { Neo4jService } from "src/neo4j/neo4j.service";
import { Player } from "./player.entity";
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Body } from "@nestjs/common";
@Resolver(()=>Player)
export class IgracResolver{

    constructor(private readonly neo4jService:Neo4jService)
    {
    }
    @Query(()=>Player)
    async addPlayer(input:Player){

        await this.neo4jService.savePlayer(input.Username,input.Password,input.NameAndSurname,input.TeamLeader);
       return {
            message:'success'
       }
    }
    @Query(()=>Player)
    async getAllPlayers()
    {
        return await this.neo4jService.getAllPlayers();
    }
}