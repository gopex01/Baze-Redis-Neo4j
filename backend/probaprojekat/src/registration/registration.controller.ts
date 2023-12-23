import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Registration } from './registration.entity';
import { RegistrationResolver } from './registration.resolver';
@Controller('Registration')
export class RegistrationController {
  constructor(private readonly registrationResolver: RegistrationResolver) {}
  @Post('createRegistration')
  async createRegistration(@Body() newRegistration: Registration) {
    return await this.registrationResolver.createRegistration(newRegistration);
  }
  @Get('getRegistration/:registrationId')
  async getRegistration(@Param('registrationId') registrationId: string) {
    return await this.registrationResolver.getRegistration(registrationId);
  }
  // @Get('getAllRegistrationsFromPlayer/:PlayerUsername')
  // async getAllRegistrationsFromPlayer(@Param('PlayerUsername') PlayerUsername:string)
  // {
  //   return await this.registrationResolver.getAllRegistrationsFromPlayer(PlayerUsername);
  // }
}
