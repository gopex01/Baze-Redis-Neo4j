import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  private readonly redisClient: Redis.Redis;
  constructor() {
    this.redisClient = new Redis();
  }
  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }
  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
   getClient() {
    return this.redisClient;
  }
}
