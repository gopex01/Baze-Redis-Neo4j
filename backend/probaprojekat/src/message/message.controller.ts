import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageEntity } from './message.entity';

@Controller('Message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post('createMessage')
  async createMessage(@Body() message: MessageEntity) {
    return this.messageService.createMessage(message);
  }
  @Get('getMessage/:iD')
  async getMessage(@Param('iD') iD: string) {
    return this.messageService.getMessage(iD);
  }
}
