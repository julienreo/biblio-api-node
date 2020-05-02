const appRoot = require("app-root-path");
const express = require("express");
const router = express.Router();

const authenticate = require(`${appRoot}/src/middleware/authenticate`);
const validator = require(`${appRoot}/src/middleware/validator`);
const constants = require(`${appRoot}/src/config/constants`);

router.post(
  "/products",
  authenticate,
  validator.validateResource("product"),
  (req, res) => {
    res.status(constants.statusCodes.success).send({success: true});
  }
);

router.post(
  "/suppliers",
  authenticate,
  validator.validateResource("supplier"),
  (req, res) => {
    res.status(constants.statusCodes.success).send({success: true});
  }
);

module.exports = router;