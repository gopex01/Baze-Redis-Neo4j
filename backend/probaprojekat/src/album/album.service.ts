import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Repository } from 'redis-om';
import { RedisClientService } from 'src/redis-client/redis-client.service';
import { schema } from './album.schema';

@Injectable()
export class AlbumService {
  private repository: Repository;
  constructor(private readonly redisClient: RedisClientService) {
   // this.repository = redisClient.fetchRepository(schema);
    // (async () => {await this.repository.createIndex()})();
  }
  async create() {
    this.repository = this.redisClient.fetchRepository(schema);
    const album = {
      artist: "Mushroomhead",
      title: "The Righteous & The Butterfly",
      year: 2014
    }
    
    await this.repository.save(album)
  }

  async findAll() {
    await this.repository.createIndex();
    const albums = await this.repository.search()
  //.where('artist').equals('Mushroomhead')
  //.and('title').matches('butterfly')
  //.and('year').is.greaterThan(2000)
    .return.all();
    return albums;
  }

  findOne(id: number) {
    return `This action returns a #${id} album`;
  }

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

  remove(id: number) {
    return `This action removes a #${id} album`;
  }
}
