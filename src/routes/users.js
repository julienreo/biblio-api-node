const appRoot = require("app-root-path");
const express = require("express");
const router = express.Router();

const authenticate = require(`${appRoot}/src/middleware/authenticate`);
const userController = require(`${appRoot}/src/controllers/user`);
const validator = require(`${appRoot}/src/middleware/validator`);

router.post(
  "/login",
  validator.validateResource("userDetails"),
  userController.login
);

router.post(
  "/",
  authenticate,
  validator.validateResource("user"),
  userController.create
);

module.exports = router;