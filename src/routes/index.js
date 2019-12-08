const appRoot = require("app-root-path");
const express = require("express");
const router = express.Router();

const users = require(`${appRoot}/src/routes/users`);
const products = require(`${appRoot}/src/routes/products`);
const suppliers = require(`${appRoot}/src/routes/suppliers`);
const productSuppliers = require(`${appRoot}/src/routes/product-suppliers`);

router.use("/users", users);

router.use("/products", products);

router.use("/suppliers", suppliers);

router.use("/productSuppliers", productSuppliers);

module.exports = router;
