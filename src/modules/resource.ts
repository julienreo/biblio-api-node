import Product, { ProductData } from '@models/product';
import ProductSupplier, { ProductSupplierData } from '@models/product-supplier';
import Supplier, { SupplierData } from '@models/supplier';
import User, { UserData } from '@models/user';
import { QueryOptions } from '@modules/database';
import { createError } from '@src/modules/errors/index';
import { ResultSetHeader } from 'mysql2';

export const createResource = (
  resourceName: string,
  data: UserData | ProductData | SupplierData | ProductSupplierData
): Product | ProductSupplier | Supplier | User => {
  switch (resourceName) {
    case 'product':
      return new Product(data as ProductData);
    case 'productSupplier':
      return new ProductSupplier(data as ProductSupplierData);
    case 'supplier':
      return new Supplier(data as SupplierData);
    case 'user':
      return new User(data as UserData);
    default:
      throw createError('ApiError', 'Invalid resource name');
  }
};

export const retrieveOneResource = async (
  resourceName: string,
  data: { [key: string]: string | number },
  options: QueryOptions
): Promise<{ [key: string]: string | number | Date }> => {
  switch (resourceName) {
    case 'user':
      return await User.findOne(data, options);
    case 'product':
      return await Product.findOne(data, options);
    case 'supplier':
      return await Supplier.findOne(data, options);
    default:
      throw createError('ApiError', 'Invalid resource name');
  }
};

export const retrieveAllResources = async (
  resourceName: string,
  data: { [key: string]: string | number },
  options: QueryOptions
): Promise<{ [key: string]: string | number | Date }[]> => {
  switch (resourceName) {
    case 'user':
      return await User.findAll(data, options);
    case 'product':
      return await Product.findAll(data, options);
    case 'supplier':
      return await Supplier.findAll(data, options);
    default:
      throw createError('ApiError', 'Invalid resource name');
  }
};

export const updateOneResource = async (
  resourceName: string,
  data: { [key: string]: string | number },
  condition: { [key: string]: number },
  options: QueryOptions
): Promise<ResultSetHeader> => {
  switch (resourceName) {
    case 'product':
      return await Product.modifyOne(data, condition, options);
    case 'supplier':
      return await Supplier.modifyOne(data, condition, options);
    case 'productSupplier':
      return await ProductSupplier.modifyOne(data, condition, options);
    default:
      throw createError('ApiError', 'Invalid resource name');
  }
};

export const deleteOneResource = async (
  resourceName: string,
  data: { [key: string]: number },
  options: QueryOptions
): Promise<ResultSetHeader> => {
  switch (resourceName) {
    case 'product':
      return await Product.deleteOne(data, options);
    case 'supplier':
      return await Supplier.deleteOne(data, options);
    case 'productSupplier':
      return await ProductSupplier.deleteOne(data, options);
    default:
      throw createError('ApiError', 'Invalid resource name');
  }
};
