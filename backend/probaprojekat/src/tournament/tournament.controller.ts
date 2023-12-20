import { Body, Controller, Post } from '@nestjs/common';
import { TournamentResolver } from './tournament.resolver';
import { Tournament } from './tournament.entity';

@Controller('Tournament')
export class TournamentController {
  constructor(private readonly tournamentResolver: TournamentResolver) {}
  @Post('addTournament')
  async addTournament(@Body() tournament: Tournament) {
    return this.tournamentResolver.addTournament(tournament);
  }
}
