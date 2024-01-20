import {
  Body,
  CacheTTL,
  Controller,
  Delete,
  Headers,
  Get,
  Param,
  Post,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TournamentResolver } from './tournament.resolver';
import { Tournament } from './tournament.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrganizatorGuard } from 'src/auth/organizator.role.guard';

@Controller('turnir')
export class TournamentController {
  constructor(private readonly tournamentResolver: TournamentResolver) {}
  @Get('sviTurniri')
  async allTournaments() {
    return this.tournamentResolver.allTournaments();
  }
  @UseGuards(JwtAuthGuard)
  @Get('mojiTurniri')
  async vratiMojeTurnire(@Headers('authorization') authorization: string) {
    return await this.tournamentResolver.vratiMojeTurnire(authorization);
  }
  @UseGuards(JwtAuthGuard, OrganizatorGuard)
  @Post('dodajTurnir')
  async addTournament(
    @Body() tournament: Tournament,
    @Headers('authorization') authorization: string,
  ) {
    return this.tournamentResolver.addTournament(tournament, authorization);
  }
  @Delete('obrisiTurnir/:tournamentId')
  async deleteTournament(@Param('tournamentId') tournamentId: string) {
    return this.tournamentResolver.deleteTournament(tournamentId);
  }

  @Get(
    'filtrirajTurnire/:pretragaNaziv?/:pretragaMesto?/:pretragaPocetniDatum?/:pretragaKrajnjiDatum?/:pretragaPocetnaNagrada?/:pretragaKrajnjaNagrada?',
  )
  async filterTournaments(
    @Query('pretragaNaziv') pretragaNaziv: string,
    @Query('pretragaMesto') pretragaMesto: string,
    @Query('pretragaPocetniDatum') pretragaPocetniDatum: string,
    @Query('pretragaKrajnjiDatum') pretragaKrajnjiDatum: string,
    @Query('pretragaPocetnaNagrada') pretragaPocetnaNagrada: number,
    @Query('pretragaKrajnjaNagrada') pretragaKrajnjaNagrada: number,
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

  @UseInterceptors(CacheInterceptor)
  @Get('searchTournament/:name')
  async searchTournament(@Param('name') name: string) {
    return await this.tournamentResolver.searchTournament(name);
  }

  @Get('getLastFive')
  async getLastFive() {
    return await this.tournamentResolver.getLastFiveTournaments();
  }
}
