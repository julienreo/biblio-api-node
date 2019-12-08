const appRoot = require("app-root-path");

const ApiError = require(`${appRoot}/src/modules/errors/api`);

class AuthenticationError extends ApiError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

class MissingTokenError extends AuthenticationError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class InvalidTokenError extends AuthenticationError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

module.exports = {
  MissingTokenError,
  InvalidTokenError
};