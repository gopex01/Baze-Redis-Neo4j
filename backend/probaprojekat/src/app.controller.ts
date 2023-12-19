import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IgracResolver } from './igrac/igrac.resolver';

@Controller('proba')
export class AppController {
  constructor(private readonly appService: AppService,private readonly igraResolver:IgracResolver) {}

  @Get('vrati')
  async getHello() {
    return this.appService.getHello();
  }
  @Post('postavi')
  async postavi(){
    this.appService.postavi();
  }

  @Post('dodajIgraca')
  async dodajIgraca()
  {
    this.igraResolver.dodajIgraca('Aleksa');
  }
}
