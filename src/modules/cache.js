const appRoot = require("app-root-path");
const redis = require("redis");

const config = require(`${appRoot}/src/config`);
const logger = require(`${appRoot}/lib/logger`);
const cacheErrors = require(`${appRoot}/src/modules/errors/cache`);

class Cache {
  constructor() {
    this.redisClient = redis.createClient({
      host: process.env.REDIS_HOST || config.redis.host,
      port: process.env.REDIS_PORT || config.redis.port
    });

    this.redisClient.on("error", (e) => {
      const error = new cacheErrors.CacheConnectionError(e.message);
      logger.error({error: error.getMessage()});
      throw error;
    });

    Object.freeze(this);
  }

  /**
   * Retrieve data in cache that matches the provided key
   *
   * @param {string} key
   * @returns {Promise}
   */
  find(key) {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (e, res) => {
        if (e) {
          const error = new cacheErrors.CacheGetError(e.message);
          logger.error({error: error.getMessage()});
          reject(error);
        }
        resolve(JSON.parse(res));
      });
    });
  }

  /**
   * Save key/value pair in cache
   *
   * @param {string} key
   * @param {string} value
   * @returns {Promise}
   */
  save(key, value) {
    return new Promise((resolve, reject) => {
      this.redisClient.set(key, value, (e) => {
        if (e) {
          const error = new cacheErrors.CacheSetError(e.message);
          logger.error({error: error.getMessage()});
          reject(error);
        }
        resolve();
      });
    });
  }

  /**
   * Delete data in cache that matches the provided key
   *
   * @param {string} key
   * @returns {Promise}
   */
  delete(key) {
    return new Promise((resolve, reject) => {
      this.redisClient.del(key, (e) => {
        if (e) {
          const error = new cacheErrors.CacheDeleteError(e.message);
          logger.error({error: error.getMessage()});
          reject(error);
        }
        resolve();
      });
    });
  }

  _deleteAll() {
    return new Promise((resolve, reject) => {
      this.redisClient.flushall((e) => {
        if (e) {
          const error = new cacheErrors.CacheDeleteAllError(e.message);
          logger.error({error: error.getMessage()});
          reject(error);
        }
        resolve();
      });
    });
  }
}

module.exports = {
  cacheClient: new Cache(),
  _Cache: Cache
};