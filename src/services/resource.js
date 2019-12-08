const appRoot = require("app-root-path");

const Supplier = require(`${appRoot}/src/models/supplier`);
const Product = require(`${appRoot}/src/models/product`);
const User = require(`${appRoot}/src/models/user`);
const ProductSupplier = require(`${appRoot}/src/models/product-supplier`);
const {NotFoundError} = require(`${appRoot}/src/modules/errors/resource`);
const {InsertionError} = require(`${appRoot}/src/modules/errors/database`);
const ApiError = require(`${appRoot}/src/modules/errors/api`);
const {dbErrorCodes} = require(`${appRoot}/src/config/constants`);

const resourcesModelsMapping = {
  user: User,
  product: Product,
  supplier: Supplier,
  productSupplier: ProductSupplier
};

/**
 * @param {string} resourceName
 * @param {Object} data
 * @param {string} errorMessage
 * @param {Object} options
 * @returns {Object}
 */
const retrieveOne = async (resourceName, data, errorMessage, options = {}) => {
  const {connection} = options;
  const allowedResourceNames = ["user", "product", "supplier"];
  let resource;

  if (allowedResourceNames.includes(resourceName)) {
    resource = await resourcesModelsMapping[resourceName].findOne(data, {connection});
  } else {
    throw new ApiError("Invalid resource name");
  }

  if (typeof resource === "undefined") {
    throw new NotFoundError(errorMessage);
  }

  return resource;
};

/**
 * @param {string} resourceName
 * @param {Object} data
 * @param {string} errorMessage
 * @param {Object} options
 * @returns {number}
 */
const insertOne = async (resourceName, data, errorMessage, options = {}) => {
  const {connection} = options;
  const allowedResourceNames = ["user", "product", "supplier", "productSupplier"];
  let resource;

  if (allowedResourceNames.includes(resourceName)) {
    resource = new resourcesModelsMapping[resourceName](data);
  } else {
    throw new ApiError("Invalid resource name");
  }

  try {
    const result = await resource.save({connection});
    return result.insertId;
  } catch (e) {
    if (e.errno === dbErrorCodes.duplicateEntryError) {
      throw new InsertionError(errorMessage);
    }
    throw e;
  }
};

/**
 * @param {string} resourceName
 * @param {Object} data
 * @param {Object} condition
 * @param {(Object|null)} errors
 * @param {Object} options
 * @returns {Object}
 */
const updateOne = async (resourceName, data, condition, errors, options = {}) => {
  const {connection} = options;
  const allowedResourceNames = ["product", "supplier", "productSupplier"];
  let result;

  if (allowedResourceNames.includes(resourceName)) {
    try {
      result = await resourcesModelsMapping[resourceName].modifyOne(data, condition, {connection});
    } catch (e) {
      if (e.errno === dbErrorCodes.duplicateEntryError) {
        throw new InsertionError(errors.alreadyExists);
      }
      throw e;
    }
  } else {
    throw new ApiError("Invalid resource name");
  }

  if (result.affectedRows === 0 && errors !== null) {
    throw new NotFoundError(errors.notFound);
  }

  return result;
};

/**
 * @param {string} resourceName
 * @param {Object} data
 * @param {(string|null)} errorMessage
 * @param {Object} options
 * @returns {Object}
 */
const removeOne = async (resourceName, data, errorMessage, options = {}) => {
  const {connection} = options;
  const allowedResourceNames = ["product", "supplier", "productSupplier"];
  let result;

  if (allowedResourceNames.includes(resourceName)) {
    result = await resourcesModelsMapping[resourceName].deleteOne(data, {connection});
  } else {
    throw new ApiError("Invalid resource name");
  }

  if (result.affectedRows === 0 && errorMessage) {
    throw new NotFoundError(errorMessage);
  }

  return result;
};

module.exports = {
  retrieveOne,
  insertOne,
  updateOne,
  removeOne
};