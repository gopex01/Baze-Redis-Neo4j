import { Neo4jService } from "src/neo4j/neo4j.service";
import { Igrac } from "./igrac.entity";
import { Resolver, Query, Args } from '@nestjs/graphql';
@Resolver(()=>Igrac)
export class IgracResolver{

    constructor(private readonly neo4jService:Neo4jService)
    {

    }
    @Query(()=>Igrac)
    async dodajIgraca(@Args('ime') ime: string):Promise<Igrac>{

        await this.neo4jService.sacuvajIgraca(ime);
        const noviIgrac:Igrac={
            id:'2',
            ime,
        };
        return noviIgrac;
    }
}