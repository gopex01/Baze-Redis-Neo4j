import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { Registration } from './registration.entity';
import { RegistrationResolver } from './registration.resolver';
@Controller('prijava')
export class RegistrationController {
  constructor(private readonly registrationResolver: RegistrationResolver) {}
  @Post('dodajPrijavu')
  async createRegistration(@Body() newRegistration: Registration) {
    return await this.registrationResolver.createRegistration(newRegistration);
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
    return await this.registrationResolver.removeTeamFromTournament(
      registrationId,
    );
  }
  //todo odjaviSvojTimSaTurnira
  // @Get('getAllRegistrationsFromPlayer/:PlayerUsername')
  // async getAllRegistrationsFromPlayer(@Param('PlayerUsername') PlayerUsername:string)
  // {
  //   return await this.registrationResolver.getAllRegistrationsFromPlayer(PlayerUsername);
  // }
}
