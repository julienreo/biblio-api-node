const appRoot = require("app-root-path");

const ApiError = require(`${appRoot}/src/modules/errors/api`);

class ResourceError extends ApiError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ValidationError extends ResourceError {
  /**
   * @param {string} message
   * @param {Array} errors
   */
  constructor(message, errors) {
    super(message);
    this.name = this.constructor.name;
    this.errors = errors;
  }

  /**
   * @returns {Object}
   */
  getMessage() {
    const error = super.getMessage();
    error.errors = this.errors;
    return error;
  }
}

class NotFoundError extends ResourceError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = 404;
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  ResourceError
};