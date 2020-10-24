import { ApiError } from '@modules/errors/api';

class CacheError extends ApiError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.status = 500;
  }
}

export class CacheConnectionError extends CacheError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CacheGetError extends CacheError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CacheSetError extends CacheError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CacheDeleteError extends CacheError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CacheDeleteAllError extends CacheError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
