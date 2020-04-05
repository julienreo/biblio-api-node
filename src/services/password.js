const appRoot = require("app-root-path");
const bcrypt = require("bcryptjs");

const {ValidationError} = require(`${appRoot}/src/modules/errors`);

/**
 * @param {string} suppliedPassword
 * @param {string} userPassword
 */
const comparePassword = async (suppliedPassword, userPassword) => {
  const passwordMatch = await bcrypt.compare(suppliedPassword, userPassword);

  if (passwordMatch === false) {
    throw new ValidationError("La validation du mot de passe a échoué", ["Mot de passe erroné"]);
  }
};

/**
 * @param {string} userPassword
 * @param {number} salt
 * @returns {string}
 */
const hashPassword = async (userPassword, salt) => {
  return await bcrypt.hash(userPassword, salt);
};

module.exports = {
  comparePassword,
  hashPassword
};