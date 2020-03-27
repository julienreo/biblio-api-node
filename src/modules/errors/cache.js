const appRoot = require("app-root-path");

const ApiError = require(`${appRoot}/src/modules/errors/api`);

class CacheError extends ApiError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.status = 500;
  }
}

class CacheConnectionError extends CacheError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class CacheGetError extends CacheError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class CacheSetError extends CacheError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class CacheDeleteError extends CacheError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class CacheDeleteAllError extends CacheError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

module.exports = {
  CacheConnectionError,
  CacheGetError,
  CacheSetError,
  CacheDeleteError,
  CacheDeleteAllError
};