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
  async getFirstFiveKeys(): Promise<string[]> {
    const allKeys = await this.redisClient.keys('Turnir:*');
    const firstFiveKeys = allKeys.slice(0, 5);
    return firstFiveKeys;
  }

  async getKeys(keyPattern: string) {
    return await this.redisClient.keys(keyPattern);
  }

  async getValuesOfKeys(keys: string[]): Promise<(string | null)[]> {
    const values = await this.redisClient.mget(keys);
    return values;
  }
  getClient() {
    return this.redisClient;
  }
}
