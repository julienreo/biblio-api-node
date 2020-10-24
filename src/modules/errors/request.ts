import { ApiError } from '@modules/errors/api';

export class RequestError extends ApiError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export class QueryParamError extends RequestError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
