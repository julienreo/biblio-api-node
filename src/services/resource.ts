import constants from '@config/constants';
import { sha1 } from '@lib/utils';
import Product, { ProductData } from '@models/product';
import ProductSupplier, { ProductSupplierData } from '@models/product-supplier';
import Supplier, { SupplierData } from '@models/supplier';
import User, { UserData } from '@models/user';
import cacheClient from '@modules/cache';
import { QueryOptions } from '@modules/database';
import { createError } from '@src/modules/error/errorFactory';
import { ResultSetHeader } from 'mysql2';

/**
 * @param resourceName
 * @param data
 * @param errorMessage
 * @param options
 */
const retrieveOne = async (
  resourceName: string,
  data: { [key: string]: string | number },
  errorMessage: string,
  options: QueryOptions = {}
): Promise<{ [key: string]: string | number | Date }> => {
  const { connection } = options;
  let resource;

  // Retrieve resource from cache, if none is found retrieve it from database and save it in cache
  const cacheKey = sha1(`${resourceName}#data:${JSON.stringify(data)}`);
  resource = await cacheClient.find(cacheKey);

  if (resource === null) {
    switch (resourceName) {
      case 'user':
        resource = await User.findOne(data, { connection });
        break;
      case 'product':
        resource = await Product.findOne(data, { connection });
        break;
      case 'supplier':
        resource = await Supplier.findOne(data, { connection });
        break;
      default:
        throw createError('ApiError', 'Invalid resource name');
    }
    if (typeof resource !== 'undefined') {
      await cacheClient.save(cacheKey, JSON.stringify(resource));
    }
  }

  if (typeof resource === 'undefined') {
    throw createError('NotFoundError', errorMessage);
  }

  return resource;
};

/**
 * @param resourceName
 * @param data
 * @param options
 */
const retrieveAll = async (
  resourceName: string,
  data: { [key: string]: string | number },
  options: QueryOptions = {}
): Promise<{ [key: string]: string | number | Date }[]> => {
  const { connection } = options;
  let resources;

  switch (resourceName) {
    case 'user':
      resources = await User.findAll(data, { connection });
      break;
    case 'product':
      resources = await Product.findAll(data, { connection });
      break;
    case 'supplier':
      resources = await Supplier.findAll(data, { connection });
      break;
    default:
      throw createError('ApiError', 'Invalid resource name');
  }

  return resources;
};

/**
 * @param resourceName
 * @param data
 * @param errorMessage
 * @param options
 */
const insertOne = async (
  resourceName: string,
  data: UserData | ProductData | SupplierData | ProductSupplierData,
  errorMessage: string,
  options: QueryOptions = {}
): Promise<number> => {
  const { connection } = options;
  let resource;

  switch (resourceName) {
    case 'user':
      resource = new User(data as UserData);
      break;
    case 'product':
      resource = new Product(data as ProductData);
      break;
    case 'supplier':
      resource = new Supplier(data as SupplierData);
      break;
    case 'productSupplier':
      resource = new ProductSupplier(data as ProductSupplierData);
      break;
    default:
      throw createError('ApiError', 'Invalid resource name');
  }

  try {
    const result = await resource.save({ connection });
    return result.insertId;
  } catch (e) {
    if (e.errno === constants.dbErrorCodes.duplicateEntryError) {
      throw createError('InsertionError', errorMessage);
    }
    throw e;
  }
};

/**
 * @param resourceName
 * @param data
 * @param condition
 * @param errors
 * @param options
 */
const updateOne = async (
  resourceName: string,
  data: { [key: string]: string | number },
  condition: { [key: string]: number },
  errors: { notFound: string; alreadyExists: string },
  options: QueryOptions = {}
): Promise<ResultSetHeader> => {
  const { connection } = options;
  let result;

  try {
    switch (resourceName) {
      case 'product':
        result = await Product.modifyOne(data, condition, { connection });
        break;
      case 'supplier':
        result = await Supplier.modifyOne(data, condition, { connection });
        break;
      case 'productSupplier':
        result = await ProductSupplier.modifyOne(data, condition, {
          connection,
        });
        break;
      default:
        throw createError('ApiError', 'Invalid resource name');
    }
    // Delete resource from cache
    const cacheKey = sha1(`${resourceName}#data:${JSON.stringify(condition)}`);
    await cacheClient.delete(cacheKey);
  } catch (e) {
    if (e.errno === constants.dbErrorCodes.duplicateEntryError) {
      throw createError('InsertionError', errors.alreadyExists);
    }
    throw e;
  }

  if (result.affectedRows === 0 && errors !== null) {
    throw createError('NotFoundError', errors.notFound);
  }

  return result;
};

/**
 * @param resourceName
 * @param data
 * @param errorMessage
 * @param options
 */
const removeOne = async (
  resourceName: string,
  data: { [key: string]: number },
  errorMessage: string | null,
  options: QueryOptions = {}
): Promise<ResultSetHeader> => {
  const { connection } = options;
  let result;

  switch (resourceName) {
    case 'product':
      result = await Product.deleteOne(data, { connection });
      break;
    case 'supplier':
      result = await Supplier.deleteOne(data, { connection });
      break;
    case 'productSupplier':
      result = await ProductSupplier.deleteOne(data, { connection });
      break;
    default:
      throw createError('ApiError', 'Invalid resource name');
  }

  if (result.affectedRows === 0 && errorMessage) {
    throw createError('NotFoundError', errorMessage);
  }

  return result;
};

export default {
  retrieveOne,
  retrieveAll,
  insertOne,
  updateOne,
  removeOne,
};
