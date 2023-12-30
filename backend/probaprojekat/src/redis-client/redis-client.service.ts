import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'redis-om';

@Injectable()
export class RedisClientService extends Client implements OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super();
    console.log('Konstruktor RedisClientService je pozvan.');
    (async () => {
      try {
        await this.open('redis://localhost:6379');
      } catch (error) {
        console.error('Fail: ', error);
        throw error;
      }
    })();
  }

  public async onModuleDestroy() {
    await this.close();
  }
}
