const appRoot = require("app-root-path");

const ApiError = require(`${appRoot}/src/modules/errors/api`);

class DatabaseError extends ApiError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class InsertionError extends DatabaseError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class RemovalError extends DatabaseError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class FormatQueryError extends DatabaseError {
  /**
   * @param {string} fieldName
   */
  constructor(fieldName) {
    super(`Missing property ${fieldName} in query parameters`);
    this.name = this.constructor.name;
  }
}

class CloseConnectionsError extends DatabaseError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.status = 500;
    this.name = this.constructor.name;
  }

  /**
   * @returns {Object}
   */
  getMessage() {
    return {
      name: this.name,
      message: this.message
    };
  }
}

module.exports = {
  InsertionError,
  RemovalError,
  FormatQueryError,
  CloseConnectionsError
};