import { IConfig } from './interfaces/config.interface';

export function config(): IConfig {
  return {
    port: 6379,//parseInt(process.env.PORT, 10),
    redisUrl: "redis://@localhost:6379"//process.env.REDIS_URL,
  };
}

export { validationSchema } from './validation.schema';