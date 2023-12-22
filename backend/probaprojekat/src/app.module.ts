import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config, validationSchema } from '../config';
import { RedisClientModule } from './redis-client/redis-client.module';
import { AlbumModule } from './album/album.module';
import { Neo4jModule } from 'nest-neo4j';
import { RedisClientService } from './redis-client/redis-client.service';
import { IgracResolver } from './player/player.resolver';
import { Neo4jService } from './neo4j/neo4j.service';
import { PlayerModule } from './player/player.module';
import { TournamentModule } from './tournament/tournament.module';
import { RegistrationModule } from './registration/registration.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //validationSchema,
      load: [config],
    }),
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'neo',
    }),
    CacheModule.register({ isGlobal: true }),
    RedisClientModule,
    AlbumModule,
    PlayerModule,
    TournamentModule,
    RegistrationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisClientService, Neo4jService],
})
export class AppModule {}
