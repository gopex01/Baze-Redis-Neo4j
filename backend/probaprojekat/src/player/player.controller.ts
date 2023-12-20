import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
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
    @Get('getOnePlayer/:username')
    async getOnePlayer(@Param('username') username:string)
    {
        return this.igracResolver.getOnePlayer(username);
    }
    @Get('getSimilarPlayers/:username')
    async getPlayersWithSimilarUsername(@Param('username') username:string)
    {
        return this.igracResolver.getPlayersWithSimilarUsername(username);
    }
    @Patch('changeData/:idPlayer')
    async changeData(@Param('idPlayer') idPlayer:string, @Body() newPlayer:Player)
    {
        return await this.igracResolver.changeData(idPlayer,newPlayer);
    }
}