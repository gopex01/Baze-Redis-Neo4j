import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Registration } from './registration.entity';
import { RegistrationResolver } from './registration.resolver';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IgracGuard } from 'src/auth/igrac.role.guard';
import { VodjaGuard } from 'src/auth/vodja.role.guard';
@Controller('prijava')
export class RegistrationController {
  constructor(private readonly registrationResolver: RegistrationResolver) {}
  @Get(':id')
  vratiPrijavuPoId(@Param('id') id: string) {
    return this.registrationResolver.vratiPrijavuPoId(id);
  }
  @UseGuards(JwtAuthGuard, IgracGuard)
  @Post('dodajPrijavu')
  async createRegistration(@Body() newRegistration: any) {
    try {
      return await this.registrationResolver.createRegistration(
        newRegistration,
      );
    } catch (error) {
      return { porukaGreske: 'Došlo je do greške prilikom obrade prijave.' };
    }
  }

  @Get('getRegistration/:registrationId')
  async getRegistration(@Param('registrationId') registrationId: string) {
    return await this.registrationResolver.getRegistration(registrationId);
  }
  @Get('prijaveNaTurniru/:tournamentId')
  async allRegistrationsForTournament(
    @Param('tournamentId') tournamentId: string,
  ) {
    return await this.registrationResolver.allRegistrationsForTournament(
      tournamentId,
    );
  }
  @Delete('izbaciTimSaTurnira/:registrationId')
  async removeTeamFromTournament(
    @Param('registrationId') registrationId: string,
  ) {
    console.log('controller id je ' + registrationId);
    return await this.registrationResolver.removeTeamFromTournament(
      registrationId,
    );
  }
  @UseGuards(JwtAuthGuard, IgracGuard, VodjaGuard)
  @Delete('odjaviSvojTimSaTurnira/:turnirId/:igracId')
  async odjaviSvojTimSaTurnira(
    @Param('turnirId') turnirId: string,
    @Param('igracId') igracId: string,
  ) {
    return await this.registrationResolver.odjaviSvojTimSaTurnira(
      turnirId,
      igracId,
    );
  }
  // @Get('getAllRegistrationsFromPlayer/:PlayerUsername')
  // async getAllRegistrationsFromPlayer(@Param('PlayerUsername') PlayerUsername:string)
  // {
  //   return await this.registrationResolver.getAllRegistrationsFromPlayer(PlayerUsername);
  // }
}
