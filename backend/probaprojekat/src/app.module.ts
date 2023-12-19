import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { config, validationSchema } from '../config';
import { RedisClientModule } from './redis-client/redis-client.module';
import { AlbumModule } from './album/album.module';
import { Neo4jModule } from 'nest-neo4j'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //validationSchema,
      load: [config],
    }),
    Neo4jModule.forRoot({
      scheme:'neo4j',
      host:'localhost',
      port:7687,
      username:'neo4j',
      password:'neo'
    }),
    RedisClientModule,
    AlbumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
