import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService{
    private readonly driver:Driver;
    
    constructor(private readonly configService:ConfigService){
        this.driver=this.createDriver();
    }
    private createDriver():Driver{
        const neo4jUrl=this.configService.get('NEO4J_URI');
        const neo4jUser=this.configService.get('NEO4J_USER');
        const neo4jPassword=this.configService.get('NEO4J_PASSWORD');
        return new Driver(neo4jUrl,neo4jUser,neo4jPassword);
    }

    async sacuvajIgraca(ime:string):Promise<void>
    {
        const session:Session=this.driver.session();
        try{
            const result=await session.run(
                'CREATE (n:Igrac {ime: $ime}) RETURN n',
                {ime}
            );
            console.log(result.records);
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