const appRoot = require("app-root-path");

const Resource = require(`${appRoot}/src/models/resource`);

class Company extends Resource {
  /**
   * @param {Object} data
   */
  constructor(data) {
    super(["name"], data);
    Object.freeze(this);
  }
}

Company.table = "company";

module.exports = Company;