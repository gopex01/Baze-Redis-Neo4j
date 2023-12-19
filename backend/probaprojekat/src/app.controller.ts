import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('proba')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('vrati')
  async getHello() {
    return this.appService.getHello();
  }
  @Post('postavi')
  async postavi(){
    this.appService.postavi();
  }
}