import constants from '@config/constants';
import { sha1 } from '@lib/utils';
import { ProductData } from '@models/product';
import { ProductSupplierData } from '@models/product-supplier';
import { SupplierData } from '@models/supplier';
import { UserData } from '@models/user';
import cacheClient from '@modules/cache';
import { QueryOptions } from '@modules/database';
import { createError } from '@src/modules/errors/index';
import {
  createResource,
  deleteOneResource,
  retrieveAllResources,
  retrieveOneResource,
  updateOneResource,
} from '@src/services/helpers/resource';
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
    resource = await retrieveOneResource(resourceName, data, { connection });

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

  const resources = await retrieveAllResources(resourceName, data, {
    connection,
  });

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

  try {
    const resource = createResource(resourceName, data);

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

  try {
    const result = await updateOneResource(resourceName, data, condition, {
      connection,
    });

    // Delete resource from cache
    const cacheKey = sha1(`${resourceName}#data:${JSON.stringify(condition)}`);
    await cacheClient.delete(cacheKey);

    if (result.affectedRows === 0 && errors !== null) {
      throw createError('NotFoundError', errors.notFound);
    }

    return result;
  } catch (e) {
    if (e.errno === constants.dbErrorCodes.duplicateEntryError) {
      throw createError('InsertionError', errors.alreadyExists);
    }
    throw e;
  }
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

  const result = await deleteOneResource(resourceName, data, { connection });

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
