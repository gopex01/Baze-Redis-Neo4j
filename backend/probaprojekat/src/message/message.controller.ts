import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageEntity } from './message.entity';
import { Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @Get('getMessagesForPlayer')
  async getMessagesForPlayer(@Request() req: any) {
    return this.messageService.getMessagesforPlayer(req.user.userId);
  }
}
