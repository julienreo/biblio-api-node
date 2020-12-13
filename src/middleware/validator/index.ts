import validator from '@middleware/helpers/validator';
import { createError } from '@src/modules/error/errorFactory';
import Ajv from 'ajv';
import ajvError from 'ajv-errors';
import { NextFunction, Request, Response } from 'express';

const ajv = new Ajv({ allErrors: true, jsonPointers: true });
ajvError(ajv);

/**
 * Based on the resource name supplied, the function validates the corresponding JSON schema
 *
 * @param resourceType
 */
const validateType = (
  resourceType:
    | 'user'
    | 'userDetails'
    | 'product'
    | 'supplier'
    | 'productSupplier'
) => (req: Request, res: Response, next: NextFunction): void => {
  const validate = ajv.compile(validator.getSchema(resourceType));
  validate(req.body);

  if (validate.errors) {
    const errorsMessages = validate.errors.map((error) => error.message);
    return next(createError('ValidationError', errorsMessages[0]));
  }

  return next();
};

/**
 * Validate that the supplied parameter name exists within the params properties of the request
 * object and that its type matches the one supplied to the function as a second argument.
 *
 * @param paramName
 * @param typeName
 */
const validateParam = (
  paramName: 'productId' | 'supplierId',
  typeName: 'number'
) => (req: Request, res: Response, next: NextFunction): void => {
  const param = req.params[paramName];

  if (typeName === 'number') {
    if (!param.match(/^[0-9]+$/u)) {
      return next(createError('QueryParamError', 'Paramètre invalide'));
    }
  } else {
    return next(createError('ApiError', 'Invalid type name'));
  }

  return next();
};

export default {
  validateType,
  validateParam,
};
