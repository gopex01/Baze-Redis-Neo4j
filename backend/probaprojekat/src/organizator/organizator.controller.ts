import {
  Body,
  Controller,
  Request,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrganizatorResolver } from './organizator.resolver';
import { Organizator } from './organizator.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrganizatorGuard } from 'src/auth/organizator.role.guard';
@Controller('organizator')
export class OrganizatorController {
  constructor(private readonly organizatorResolver: OrganizatorResolver) {}
  @Get('findOne/:username')
  findOne(@Param('username') username: string) {
    return this.organizatorResolver.findOneOrganizator(username);
  }
  @Post('registrujOrganizatora')
  async registrujOrganizatora(@Body() organizator: Organizator) {
    return await this.organizatorResolver.registrujOrganizatora(organizator);
  }
  @UseGuards(JwtAuthGuard, OrganizatorGuard)
  @Get('daLiJeOrganizatorTurnira/:organizatorId/:turnirId')
  async daLiJeOrganizatorTurnira(
    @Param('organizatorId') organizationId: string,
    @Param('turnirId') turnirId: string,
  ) {
    return await this.organizatorResolver.daLiJeOrganizatorTurnira(
      organizationId,
      turnirId,
    );
  }
  @UseGuards(JwtAuthGuard, OrganizatorGuard)
  @Put('izmeniPodatkeOOrganizatoru')
  async changeOrganizatorData(
    @Request() req: any,
    @Body() organizator: Organizator,
  ) {
    return this.organizatorResolver.changeOrganizatorData(
      req.user.userId,
      organizator,
    );
  }
}
