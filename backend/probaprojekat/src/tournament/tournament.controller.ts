import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
