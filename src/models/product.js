const appRoot = require("app-root-path");

const Resource = require(`${appRoot}/src/models/resource`);

class Product extends Resource {
  /**
   * @param {Object} data
   */
  constructor(data) {
    super(["name", "notes", "fkCompany"], data);
    Object.freeze(this);
  }
}

Product.table = "product";

module.exports = Product;