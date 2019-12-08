/* eslint-disable no-undef,no-magic-numbers,no-unused-expressions */
const appRoot = require("app-root-path");

const authenticationService = require(`${appRoot}/src/services/authentication`);

const getAccessToken = async () => await authenticationService.getAccessToken(1);

module.exports = {
  getAccessToken
};