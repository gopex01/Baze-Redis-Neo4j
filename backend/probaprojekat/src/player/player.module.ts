import { Module } from "@nestjs/common";
import { PlayerController } from "./player.controller";
import { IgracResolver } from "./player.resolver";
import { Neo4jService } from "src/neo4j/neo4j.service";

@Module({
    imports:[],
    providers:[IgracResolver,Neo4jService],
    controllers:[PlayerController]
})
export class PlayerModule{}