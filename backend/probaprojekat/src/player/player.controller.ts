import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { IgracResolver } from "./player.resolver";
import {  Player } from "./player.entity";
import { identity } from "rxjs";

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
    @Get('getPlayerById/:playerId')
    async getPlayerById(@Param('playerId') playerId:string)
    {
        return await this.igracResolver.getPlayerById(playerId);
    }
    @Patch('signInPlayerOnTournament/:playerUsername/:tournamentName')
    async signInPlayerOnTournament(@Param('playerUsername') playerUsername:string, @Param('tournamentName') tournamentName:string)
    {
        return await this.igracResolver.signInPlayerOnTournament(playerUsername,tournamentName);
    }
}