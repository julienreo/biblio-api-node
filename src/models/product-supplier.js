const appRoot = require("app-root-path");

const Resource = require(`${appRoot}/src/models/resource`);

/**
 * Model that represents the association between a product and a supplier
 */
class ProductSupplier extends Resource {
  /**
   * @param {Object} data
   */
  constructor(data) {
    super(["fkProduct", "fkSupplier", "fkUser", "notes"], data);
    Object.freeze(this);
  }
}

ProductSupplier.table = "at_product_supplier";

module.exports = ProductSupplier;