import { camelToSnakeObject, snakeToCamelObject } from '@lib/utils';
import {
  CompanyData,
  CompanyFields,
  CompanyFieldsValues,
} from '@models/company';
import {
  ProductData,
  ProductFields,
  ProductFieldsValues,
} from '@models/product';
import {
  ProductSupplierData,
  ProductSupplierFields,
  ProductSupplierFieldsValues,
} from '@models/product-supplier';
import {
  SupplierData,
  SupplierFields,
  SupplierFieldsValues,
} from '@models/supplier';
import { UserData, UserFields, UserFieldsValues } from '@models/user';
import databaseClient, { QueryOptions } from '@modules/database';
import { ResultSetHeader } from 'mysql2';

export default class Resource {
  static table: string;

  /**
   * @param allowedFields
   * @param data
   */
  constructor(
    allowedFields:
      | UserFields
      | ProductFields
      | SupplierFields
      | CompanyFields
      | ProductSupplierFields,
    data:
      | UserData
      | ProductData
      | SupplierData
      | CompanyData
      | ProductSupplierData
  ) {
    allowedFields.forEach(
      (
        field:
          | UserFieldsValues
          | ProductFieldsValues
          | SupplierFieldsValues
          | CompanyFieldsValues
          | ProductSupplierFieldsValues
      ) => {
        // If an optional field is not passed
        if (typeof (data as any)[field] === 'undefined') {
          (this as any)[field] = null;
        } else {
          (this as any)[field] = (data as any)[field];
        }
      }
    );
  }

  /**
   * @param {Object} data
   * @param {Object} options
   * @returns {Object}
   */
  static async findOne(
    data: { [key: string]: string | number },
    options: QueryOptions = {}
  ): Promise<undefined | { [key: string]: string | number | Date }> {
    const { connection } = options;
    const { table } = this;

    const newData = camelToSnakeObject(data);

    const clause = Object.keys(newData)
      .map((key) => `${key} = :${key}`)
      .join(' AND ');

    const sql = `SELECT * FROM ${table} WHERE ${clause}`;

    const res = (await databaseClient.query(sql, {
      params: newData,
      connection,
    })) as { [key: string]: string | number | Date }[];

    return typeof res[0] === 'undefined' ? res[0] : snakeToCamelObject(res[0]);
  }

  /**
   * @param data
   * @param options
   */
  static async findAll(
    data: { [key: string]: string | number },
    options: QueryOptions = {}
  ): Promise<{ [key: string]: string | number | Date }[]> {
    const { connection } = options;
    const { table } = this;

    const newData = camelToSnakeObject(data);

    const clause = Object.keys(newData)
      .map((key) => `${key} = :${key}`)
      .join(' AND ');

    const sql = `SELECT * FROM ${table} WHERE ${clause}`;

    const res = (await databaseClient.query(sql, {
      params: newData,
      connection,
    })) as { [key: string]: string | number | Date }[];

    return typeof res[0] === 'undefined'
      ? []
      : res.map((v) => snakeToCamelObject(v));
  }

  /**
   * @param options
   */
  async save(options: QueryOptions = {}): Promise<ResultSetHeader> {
    const { connection } = options;
    const { table } = Object.getPrototypeOf(this).constructor;

    const resource = camelToSnakeObject(this as any);

    const keys = Object.keys(resource);
    const preparedValues = keys.map((item) => `:${item}`);

    const sql = `INSERT INTO ${table} (${keys.join(
      ','
    )}) VALUES (${preparedValues.join(',')})`;

    return (await databaseClient.query(sql, {
      params: resource,
      connection,
    })) as ResultSetHeader;
  }

  /**
   * @param data
   * @param condition
   * @param options
   */
  static async modifyOne(
    data: { [key: string]: string | number },
    condition: { [key: string]: number },
    options: QueryOptions = {}
  ): Promise<ResultSetHeader> {
    const { connection } = options;
    const { table } = this;

    const newData = camelToSnakeObject(data);
    const newCondition = camelToSnakeObject(condition);

    const preparedValues = Object.keys(newData)
      .map((key) => `${key} = :${key}`)
      .join(', ');
    const clause = Object.keys(newCondition)
      .map((key) => `${key} = :${key}`)
      .join(' AND ');

    const sql = `UPDATE ${table} SET ${preparedValues} WHERE ${clause}`;

    return (await databaseClient.query(sql, {
      params: { ...newData, ...newCondition },
      connection,
    })) as ResultSetHeader;
  }

  /**
   * @param object
   * @param options
   */
  static async deleteOne(
    object: { [key: string]: number },
    options: QueryOptions = {}
  ): Promise<ResultSetHeader> {
    const { connection } = options;
    const { table } = this;

    const newObject = camelToSnakeObject(object);

    const condition = Object.keys(newObject)
      .map((key) => `${key} = :${key}`)
      .join(' AND ');

    const sql = `DELETE FROM ${table} WHERE ${condition}`;

    return (await databaseClient.query(sql, {
      params: newObject,
      connection,
    })) as ResultSetHeader;
  }
}
