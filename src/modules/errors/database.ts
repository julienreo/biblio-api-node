import { ApiError } from '@src/modules/errors/api';

class DatabaseError extends ApiError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export class InsertionError extends DatabaseError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class RemovalError extends DatabaseError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class FormatQueryError extends DatabaseError {
  /**
   * @param fieldName
   */
  constructor(fieldName: string) {
    super(`Missing property ${fieldName} in query parameters`);
    this.name = this.constructor.name;
  }
}

export class CloseConnectionsError extends DatabaseError {
  /**
   * @param message
   */
  constructor(message: string) {
    super(message);
    this.status = 500;
    this.name = this.constructor.name;
  }

  getMessage(): { name: string; message: string } {
    return {
      name: this.name,
      message: this.message,
    };
  }
}
