import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Driver, Session } from 'neo4j-driver';
import neo4j from 'neo4j-driver';
import { throwIfEmpty } from "rxjs";
import { Player } from "src/player/player.entity";

@Injectable()
export class Neo4jService{
    private readonly driver;
    
    constructor(private readonly configService:ConfigService){
        this.driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('',''));
    }
    async savePlayer(username:string,password:string,NameAndSurname:string,TeamLeader:boolean):Promise<void>
    {
        const session:Session=this.driver.session();
        try{
            const result=await session.run(
                'CREATE (n:Player {Username:$username, Password:$password, NameAndSurname:$NameAndSurname, TeamLeader:$TeamLeader}) RETURN n',
                {username,password,NameAndSurname,TeamLeader},
            );
            console.log(result.records);
        }
        finally{
            await session.close();
        }
    }
    async getAllPlayers()
    {
      const session:Session=this.driver.session();
      try{
        const result=await session.run('MATCH (n:Player) RETURN n');
        console.log("Bez records");
        console.log(result);
        console.log("Sa records");
        console.log(result.records);
        return result.records.map(record=>record.get('n').properties);
      } 
      finally{
        await session.close();
      }
    }
    async getOnePlayer(username:string)
    {
        const session:Session=this.driver.session();
        try{
            const result=await session.run('MATCH (n:Player {Username: $username}) RETURN n ',
            {username});
            if(result.records.length>0)
            {
                const player=result.records[0].get('n').properties;
                return player;
            }
            else
            {
                return null;
            }
        }
        finally{
            await session.close();
        }
    }
    async getPlayersWithSimilarUsername(username:string)
    {
        const session:Session=this.driver.session();
        try{
            const result=await session.run('MATCH (n:Player) WHERE n.Username CONTAINS $username RETURN n',
            {username});
            const players=result.records.map(record=>record.get('n').properties);
            return players;
        }
        finally{
            await session.close();
        }
    }
    async changeData(idPlayer:string,username:string,password:string,NameAndSurname:string,TeamLeader:boolean)
    {
        const session:Session=this.driver.session();
        try{
            const result=await session.run('MATCH (n:Player {Id: $idPlayer}) SET n.Username=$username, n.Password=$password, n.NameAndSurname=$NameAndSurname, n.TeamLeader=$TeamLeader RETURN n',
            {idPlayer,
             username,
             password,
             NameAndSurname,
             TeamLeader});
            if(result.records.length>0)
            {
                const updatedPlayer=result.records[0].get('n').properties;
                return updatedPlayer;
            }
            else
            {
                return null;
            }
        }
        finally{
            await session.close();
        }
    }
    async close():Promise<void>
    {
        await this.driver.close();
    }
}