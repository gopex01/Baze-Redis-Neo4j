import { Injectable } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import * as cacheManager from 'cache-manager';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  private readonly redisClient: Redis.Redis;
  constructor() {
    this.redisClient = new Redis();
  }
  async set(key: string, value: string, expiresInSec: number): Promise<void> {
    await this.redisClient.set(key, value, 'EX', expiresInSec);
  }
  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
  getClient() {
    return this.redisClient;
  }
}
