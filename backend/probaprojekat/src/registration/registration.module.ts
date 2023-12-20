import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RedisService } from 'src/redis-client/redis.service';
import { RegistrationController } from './registration.controller';

@Module({
  imports: [],
  providers: [RegistrationService, RedisService],
  controllers: [RegistrationController],
})
export class RegistrationModule {}
