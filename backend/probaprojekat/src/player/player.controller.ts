import { Body, Controller, Get, Post } from "@nestjs/common";
import { IgracResolver } from "./player.resolver";
import {  Player } from "./player.entity";

@Controller('player')
export class PlayerController
{
    constructor(private readonly igracResolver:IgracResolver)
    {

    }
    @Post('addPlayer')
    async addPlayer(@Body() player:Player)
    {
        return this.igracResolver.addPlayer(player);
    }
    @Get('getAllPlayers')
    async getAllPlayers()
    {
        return this.igracResolver.getAllPlayers();
    }
}