import { ApiError } from '@modules/errors/api';

class AuthenticationError extends ApiError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.status = 401;
  }
}

export class MissingTokenError extends AuthenticationError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidTokenError extends AuthenticationError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
