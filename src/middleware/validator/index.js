const appRoot = require("app-root-path");

const Ajv = require("ajv");
const ajv = new Ajv({allErrors: true, jsonPointer: true});
require("ajv-errors")(ajv);

const {ApiError, ValidationError, QueryParamError} = require(`${appRoot}/src/modules/errors`);
const productSchema = require(`${appRoot}/src/middleware/validator/schemas/product`);
const supplierSchema = require(`${appRoot}/src/middleware/validator/schemas/supplier`);
const userDetailsSchema = require(`${appRoot}/src/middleware/validator/schemas/user-details`);
const userSchema = require(`${appRoot}/src/middleware/validator/schemas/user`);
const productSupplierSchema = require(`${appRoot}/src/middleware/validator/schemas/product-supplier`);
const logger = require(`${appRoot}/lib/logger`);

const resourceSchemaMapping = {
  user: userSchema,
  userDetails: userDetailsSchema,
  product: productSchema,
  supplier: supplierSchema,
  productSupplier: productSupplierSchema
};

/**
 * Based on the resource name supplied, the function validates the corresponding JSON schema
 *
 * @param {string} resourceName
 * @returns {Function}
 */
const validateResource = (resourceName) => {
  return (req, res, next) => {
    const data = req.body;
    const allowedResourceNames = ["user", "userDetails", "product", "supplier", "productSupplier"];
    let schema;

    if (allowedResourceNames.includes(resourceName)) {
      schema = resourceSchemaMapping[resourceName];
    } else {
      return next(new ApiError("Invalid object name"));
    }

    const validate = ajv.compile(schema);

    validate(data);

    if (validate.errors) {
      const errorsMessages = validate.errors.map((error) => error.message);
      const error = new ValidationError("La validation a echoué", errorsMessages);
      const userId = typeof req.accessToken === "undefined" ? req.accessToken : req.accessToken.id;
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId, error});
      return res.status(error.status).send({error: error.getMessage()});
    }

    return next();
  };
};

/**
 * Validate that the supplied parameter name exists within the params properties of the request
 * object and that its type matches the one supplied to the function as a second argument.
 *
 * @param {string} paramName
 * @param {string} typeName
 * @returns {Function}
 */
const validateParam = (paramName, typeName) => {
  return (req, res, next) => {
    const param = req.params[paramName];

    if (typeName === "number") {
      if (!param.match(/^[0-9]+$/u)) {
        const error = new QueryParamError("Paramètre invalide");
        const userId = typeof req.accessToken === "undefined" ? req.accessToken : req.accessToken.id;
        logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId, error});
        return res.status(error.status).send({error: error.getMessage()});
      }
    } else {
      return next(new ApiError("Invalid type name"));
    }

    return next();
  };
};

module.exports = {
  validateResource,
  validateParam
};