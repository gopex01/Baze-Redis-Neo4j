import {
  Body,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TournamentResolver } from './tournament.resolver';
import { Tournament } from './tournament.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('Tournament')
export class TournamentController {
  constructor(private readonly tournamentResolver: TournamentResolver) {}
  @Get('allTournaments')
  async allTournaments() {
    return this.tournamentResolver.allTournaments();
  }
  @Post('addTournament')
  async addTournament(@Body() tournament: Tournament) {
    return this.tournamentResolver.addTournament(tournament);
  }
  @Delete('deleteTournament/:tournamentId')
  async deleteTournament(@Param('tournamentId') tournamentId: string) {
    return this.tournamentResolver.deleteTournament(tournamentId);
  }
  //!NE RADI
  @Get(
    'filterTournaments/:pretragaNaziv/:pretragaMesto/:pretragaPocetniDatum/:pretragaKrajnjiDatum/:pretragaPocetnaNagrada/:pretragaKrajnjaNagrada',
  )
  async filterTournaments(
    @Param('pretragaNaziv') pretragaNaziv: string | undefined = '',
    @Param('pretragaMesto') pretragaMesto: string | undefined = '',
    @Param('pretragaPocetniDatum')
    pretragaPocetniDatum: string | undefined = '',
    @Param('pretragaKrajnjiDatum')
    pretragaKrajnjiDatum: string | undefined = '',
    @Param('pretragaPocetnaNagrada')
    pretragaPocetnaNagrada: number | undefined = 0,
    @Param('pretragaKrajnjaNagrada')
    pretragaKrajnjaNagrada: number | undefined = 0,
  ) {
    return this.tournamentResolver.filterTournaments(
      pretragaNaziv,
      pretragaMesto,
      pretragaPocetniDatum,
      pretragaKrajnjiDatum,
      pretragaPocetnaNagrada,
      pretragaKrajnjaNagrada,
    );
  }
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get('getOneTournament/:name')
  async getOneTournament(@Param('name') name: string) {
    return await this.tournamentResolver.getOneTournament(name);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get('getTournamentById/:tournamentId')
  async getTournamentById(@Param('tournamentId') tournamentId: string) {
    return await this.tournamentResolver.getTournamentById(tournamentId);
  }
  @Get('getAllPlayersOnTournament/:tournamentName')
  async getAllPlayersOnTournament(
    @Param('tournamentName') tournamentName: string,
  ) {
    return await this.tournamentResolver.getAllPlayersOnTournament(
      tournamentName,
    );
  }
}
