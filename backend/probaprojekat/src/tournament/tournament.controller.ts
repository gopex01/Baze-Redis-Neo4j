import { Body, CacheTTL, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
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
  //parametri u get
  @Get('filterTournaments')
  async filterTournaments(
    pretragaNaziv: string | undefined,
    pretragaMesto: string | undefined,
    pretragaPocetniDatum: string | undefined,
    pretragaKrajnjiDatum: string | undefined,
    pretragaPocetnaNagrada: number | undefined,
    pretragaKrajnjaNagrada: number | undefined,
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
  async getOneTournament(@Param('name') name:string)
  {
    return await this.tournamentResolver.getOneTournament(name);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get('getTournamentById/:tournamentId')
  async getTournamentById(@Param('tournamentId') tournamentId:string)
  {
    return await this.tournamentResolver.getTournamentById(tournamentId);
  }
}
