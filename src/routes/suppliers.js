const appRoot = require("app-root-path");
const express = require("express");
const router = express.Router();

const authenticate = require(`${appRoot}/src/middleware/authenticate`);
const validator = require(`${appRoot}/src/middleware/validator`);
const supplierController = require(`${appRoot}/src/controllers/supplier`);
const productController = require(`${appRoot}/src/controllers/product`);

router.get(
  "/:supplierId",
  authenticate,
  validator.validateParam("supplierId", "number"),
  supplierController.fetchOne
);

router.get(
  "/",
  authenticate,
  supplierController.fetchAll
);

router.post(
  "/:supplierId/products",
  authenticate,
  validator.validateParam("supplierId", "number"),
  validator.validateResource("product"),
  productController.create
);

router.post(
  "/",
  authenticate,
  validator.validateResource("supplier"),
  supplierController.create
);

router.put(
  "/:supplierId",
  authenticate,
  validator.validateResource("supplier"),
  supplierController.update
);

router.delete(
  "/:supplierId",
  authenticate,
  validator.validateParam("supplierId", "number"),
  supplierController.remove
);

module.exports = router;
