import config from '@config/index';
import logger from '@lib/logger';
import { createError } from '@src/modules/errors/index';
import redis from 'redis';

class Cache {
  redisClient: redis.RedisClient;

  constructor() {
    this.redisClient = redis.createClient({
      host: process.env.REDIS_HOST || config.redis.host,
      port: parseInt(process.env.REDIS_PORT) || parseInt(config.redis.port),
    });

    this.redisClient.on('error', (e) => {
      const error = createError('CacheConnectionError', e.message);
      logger.error({ errors: [error.message] });
      throw error;
    });

    Object.freeze(this);
  }

  /**
   * Retrieve data in cache that matches the provided key
   *
   * @param key
   */
  find(key: string): Promise<{ [key: string]: string | number }> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (e, res) => {
        if (e) {
          const error = createError('CacheGetError', e.message);
          logger.error({ errors: [error.message] });
          reject(error);
        }
        resolve(JSON.parse(res));
      });
    });
  }

  /**
   * Save key/value pair in cache
   *
   * @param key
   * @param value
   */
  save(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient.set(key, value, (e) => {
        if (e) {
          const error = createError('CacheSetError', e.message);
          logger.error({ errors: [error.message] });
          reject(error);
        }
        resolve();
      });
    });
  }

  /**
   * Delete data in cache that matches the provided key
   *
   * @param key
   */
  delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient.del(key, (e) => {
        if (e) {
          const error = createError('CacheDeleteError', e.message);
          logger.error({ errors: [error.message] });
          reject(error);
        }
        resolve();
      });
    });
  }

  _deleteAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient.flushall((e) => {
        if (e) {
          const error = createError('CacheDeleteAllError', e.message);
          logger.error({ errors: [error.message] });
          reject(error);
        }
        resolve();
      });
    });
  }
}

export default new Cache();

export const _Cache = Cache;
