import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { RedisClientService } from './redis-client/redis-client.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
