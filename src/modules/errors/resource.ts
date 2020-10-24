import { ApiError } from '@modules/errors/api';

export class ResourceError extends ApiError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export class ValidationError extends ResourceError {
  errors: string[];

  /**
   * @param message
   * @param errors
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends ResourceError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 404;
  }
}
