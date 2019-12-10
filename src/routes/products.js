const appRoot = require("app-root-path");
const express = require("express");
const router = express.Router();

const authenticate = require(`${appRoot}/src/middleware/authenticate`);
const validator = require(`${appRoot}/src/middleware/validator`);
const productController = require(`${appRoot}/src/controllers/product`);
const supplierController = require(`${appRoot}/src/controllers/supplier`);

router.get(
  "/:productId",
  authenticate,
  validator.validateParam("productId", "number"),
  productController.find
);

router.post(
  "/:productId/suppliers",
  authenticate,
  validator.validateParam("productId", "number"),
  validator.validateResource("supplier"),
  supplierController.create
);

router.post(
  "/",
  authenticate,
  validator.validateResource("product"),
  productController.create
);

router.put(
  "/:productId",
  authenticate,
  validator.validateResource("product"),
  productController.update
);

router.delete(
  "/:productId",
  authenticate,
  validator.validateParam("productId", "number"),
  productController.remove
);

module.exports = router;