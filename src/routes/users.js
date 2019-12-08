const appRoot = require("app-root-path");
const express = require("express");
const router = express.Router();

const userController = require(`${appRoot}/src/controllers/user`);
const validator = require(`${appRoot}/src/middleware/validator`);

router.post(
  "/login",
  validator.validateObject("userDetails"),
  userController.login
);

router.post(
  "/",
  validator.validateObject("user"),
  userController.create
);

module.exports = router;