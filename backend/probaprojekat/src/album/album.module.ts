import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { RedisClientModule } from 'src/redis-client/redis-client.module';

@Module({
  imports: [RedisClientModule],
  controllers: [AlbumController],
  providers: [AlbumService]
})
export class AlbumModule {}
