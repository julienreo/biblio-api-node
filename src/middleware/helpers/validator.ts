import productSchema from '@middleware/validator/schemas/product';
import productSupplierSchema from '@middleware/validator/schemas/product-supplier';
import supplierSchema from '@middleware/validator/schemas/supplier';
import userSchema from '@middleware/validator/schemas/user';
import userDetailsSchema from '@middleware/validator/schemas/user-details';
import { ApiError } from '@modules/errors';

/**
 * Returns the JSON schema that corresponds to the provided resource type
 *
 * @param resourceType
 */
const getSchema = (
  resourceType: string
):
  | typeof productSchema
  | typeof supplierSchema
  | typeof userDetailsSchema
  | typeof userSchema
  | typeof productSupplierSchema => {
  switch (resourceType) {
    case 'user':
      return userSchema;
    case 'userDetails':
      return userDetailsSchema;
    case 'product':
      return productSchema;
    case 'supplier':
      return supplierSchema;
    case 'productSupplier':
      return productSupplierSchema;
    default:
      throw new ApiError('Invalid object name');
  }
};

export default {
  getSchema,
};
