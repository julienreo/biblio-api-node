const appRoot = require("app-root-path");

const Resource = require(`${appRoot}/src/models/resource`);

class Supplier extends Resource {
  /**
   * @param {Object} data
   */
  constructor(data) {
    super(["name", "website", "notes", "fkUser"], data);
    Object.freeze(this);
  }
}

Supplier.table = "supplier";

module.exports = Supplier;