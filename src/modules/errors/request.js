const appRoot = require("app-root-path");

const ApiError = require(`${appRoot}/src/modules/errors/api`);

class RequestError extends ApiError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class QueryParamError extends RequestError {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

module.exports = {
  RequestError,
  QueryParamError
};