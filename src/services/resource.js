const appRoot = require("app-root-path");

const Supplier = require(`${appRoot}/src/models/supplier`);
const Product = require(`${appRoot}/src/models/product`);
const User = require(`${appRoot}/src/models/user`);
const ProductSupplier = require(`${appRoot}/src/models/product-supplier`);
const {ApiError, NotFoundError, InsertionError} = require(`${appRoot}/src/modules/errors`);
const {dbErrorCodes} = require(`${appRoot}/src/config/constants`);
const {cacheClient} = require(`${appRoot}/src/modules/cache`);
const utils = require(`${appRoot}/lib/utils`);

const resourceModelMapping = {
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
  const resourceModel = resourceModelMapping[resourceName];
  const allowedResourceNames = ["user", "product", "supplier"];
  let resource;

  if (allowedResourceNames.includes(resourceName)) {
    // Retrieve resource from cache, if none is found retrieve it from database and save it in cache
    const cacheKey = utils.sha1(`${resourceName}#data:${JSON.stringify(data)}`);
    resource = await cacheClient.find(cacheKey);
    if (resource === null) {
      resource = await resourceModel.findOne(data, {connection});
      if (typeof resource !== "undefined") {
        await cacheClient.save(cacheKey, JSON.stringify(resource));
      }
    }
  } else {
    throw new ApiError("Invalid resource name");
  }

  if (typeof resource === "undefined") {
    throw new NotFoundError(errorMessage);
  }

  return resource;
};

const retrieveAll = async (resourceName, data, errorMessage, options = {}) => {
  const {connection} = options;
  const resourceModel = resourceModelMapping[resourceName];
  const allowedResourceNames = ["user", "product", "supplier"];
  let resource;

  if (allowedResourceNames.includes(resourceName)) {
    // Retrieve resource from cache, if none is found retrieve it from database and save it in cache
    const cacheKey = utils.sha1(`${resourceName}#data:${JSON.stringify(data)}`);
    resource = await cacheClient.find(cacheKey);
    if (resource === null) {
      resource = await resourceModel.findAll(data, {connection});
      if (typeof resource !== "undefined") {
        await cacheClient.save(cacheKey, JSON.stringify(resource));
      }
    }
  } else {
    throw new ApiError("Invalid resource name");
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
  const resourceModel = resourceModelMapping[resourceName];
  const allowedResourceNames = ["user", "product", "supplier", "productSupplier"];
  let resource;

  if (allowedResourceNames.includes(resourceName)) {
    resource = new resourceModel(data);
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
  const resourceModel = resourceModelMapping[resourceName];
  const allowedResourceNames = ["product", "supplier", "productSupplier"];
  let result;

  if (allowedResourceNames.includes(resourceName)) {
    try {
      result = await resourceModel.modifyOne(data, condition, {connection});
      // Delete resource from cache
      const cacheKey = utils.sha1(`${resourceName}#data:${JSON.stringify(condition)}`);
      await cacheClient.delete(cacheKey);
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
  const resourceModel = resourceModelMapping[resourceName];
  const allowedResourceNames = ["product", "supplier", "productSupplier"];
  let result;

  if (allowedResourceNames.includes(resourceName)) {
    result = await resourceModel.deleteOne(data, {connection});
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
  retrieveAll,
  insertOne,
  updateOne,
  removeOne
};