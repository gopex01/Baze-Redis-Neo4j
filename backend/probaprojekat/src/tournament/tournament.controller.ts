import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TournamentResolver } from './tournament.resolver';
import { Tournament } from './tournament.entity';

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
  @Post('signInPlayerOnTournament/:playerId/:tournamentId')
  async signInPlayerOnTournament(
    @Param('playerId') playerId: number,
    @Param('tournamentId') tournamentId: number,
  ) {
    return this.tournamentResolver.signInPlayerOnTournament(
      playerId,
      tournamentId,
    );
  }
}
