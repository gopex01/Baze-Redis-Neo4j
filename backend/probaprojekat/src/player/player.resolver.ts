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
    @Query(()=>Player)
    async getOnePlayer(username:string)
    {
        return await this.neo4jService.getOnePlayer(username);
    }
    @Query(()=>Player)
    async getPlayersWithSimilarUsername(username:string)
    {
        return await this.neo4jService.getPlayersWithSimilarUsername(username);
    }
    @Query(()=>Player)
    async changeData(idPlayer:string, newPlayer:Player)
    {
        return await this.neo4jService.changeData(idPlayer,newPlayer.Username,newPlayer.Password,newPlayer.NameAndSurname,newPlayer.TeamLeader);
        
    }
    @Query(()=>Player)
    async signInPlayerOnTournament(playerUsername: string, tournamentName: string)
    {
        return await this.neo4jService.signInPlayerOnTournament(playerUsername,tournamentName);
    }
}