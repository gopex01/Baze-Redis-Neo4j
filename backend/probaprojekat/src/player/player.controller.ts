import {
  Body,
  Controller,
  Request,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IgracResolver } from './player.resolver';
import { Player } from './player.entity';
import { identity } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IgracGuard } from 'src/auth/igrac.role.guard';
//
@Controller('igrac')
export class PlayerController {
  constructor(private readonly igracResolver: IgracResolver) {}
  @Post('registrujIgraca')
  async addPlayer(@Body() player: Player) {
    return this.igracResolver.addPlayer(player);
  }

  @Get('getAllPlayers')
  async getAllPlayers() {
    return this.igracResolver.getAllPlayers();
  }
  @UseGuards(JwtAuthGuard, IgracGuard)
  @Get('vratiMoguceSaigrace')
  async vratiMoguceSaigrace(@Request() req: any) {
    return await this.igracResolver.vratiMoguceSaigrace(req.user.userId);
  }
  @Get('dohvatiIgraca/:username')
  async getOnePlayer(@Param('username') username: string) {
    return this.igracResolver.getOnePlayer(username);
  }

  @Get('korisnickoIme/:username')
  async getPlayersWithSimilarUsername(@Param('username') username: string) {
    return this.igracResolver.getPlayersWithSimilarUsername(username);
  }
  // @Get('findOne/:username')
  // findOne(@Param('username') username: string) {
  //   return this.igracResolver.findOne(username);
  // }
  @UseGuards(JwtAuthGuard, IgracGuard)
  @Put('izmeniPodatkeOIgracu')
  async changeData(@Request() req: any, @Body() newPlayer: Player) {
    console.log(newPlayer);
    return await this.igracResolver.changePlayerData(
      req.user.userId,
      newPlayer,
    );
  }
  @Get('getPlayerById/:playerId')
  async getPlayerById(@Param('playerId') playerId: string) {
    return await this.igracResolver.getPlayerById(playerId);
  }
  // @Patch('registerPlayerForTournament/:playerUsername/:tournamentId')
  // async registerPlayerForTournament(
  //   @Param('playerUsername') playerUsername: string,
  //   @Param('tournamentId') tournamentId: string,
  // ) {
  //   return await this.igracResolver.registerPlayerForTournament(
  //     playerUsername,
  //     tournamentId,
  //   );
  // }
  @Get('getPlayerTournaments/:playerUsername')
  async getPlayerTournaments(@Param('playerUsername') playerUsername: string) {
    return await this.igracResolver.getPlayerTournaments(playerUsername);
  }
  @Get('vratiIgraceIzIstogTima/:turnirId/:igracId')
  async getTeammates(
    @Param('turnirId') turnirId: string,
    @Param('igracId') igracId: string,
  ) {
    return await this.igracResolver.getTeammates(turnirId, igracId);
  }
  @Get('daLiJeIgracPrijavljenNaTurnir/:tournamentId/:playerId')
  async isPlayerRegisteredForTournament(
    @Param('tournamentId')
    tournamentId: string,
    @Param('playerId') playerId: string,
  ) {
    return await this.igracResolver.isPlayerRegisteredForTournament(
      tournamentId,
      playerId,
    );
  }
}
