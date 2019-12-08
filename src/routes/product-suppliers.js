const appRoot = require("app-root-path");
const express = require("express");
const router = express.Router();

const authenticate = require(`${appRoot}/src/middleware/authenticate`);
const validator = require(`${appRoot}/src/middleware/validator`);
const productSupplierController = require(`${appRoot}/src/controllers/product-supplier`);

router.post(
  "/",
  authenticate,
  validator.validateObject("productSupplier"),
  productSupplierController.create
);

router.put(
  "/",
  authenticate,
  validator.validateObject("productSupplier"),
  productSupplierController.update
);

router.delete(
  "/",
  authenticate,
  validator.validateObject("productSupplier"),
  productSupplierController.remove
);

module.exports = router;
