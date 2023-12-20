import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { Registration } from './registration.entity';
@Controller('Registration')
export class RegistrationController {
  constructor(private readonly RegistrationService: RegistrationService) {}
  @Post('createRegistration')
  async createRegistration(@Body() newRegistration: Registration) {
    return await this.RegistrationService.createRegistration(newRegistration);
  }
  @Get('getRegistration/:registrationId')
  async getRegistration(@Param('registrationId') registrationId: string) {
    return await this.RegistrationService.getRegistration(registrationId);
  }
}
