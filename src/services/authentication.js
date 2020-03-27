const appRoot = require("app-root-path");
const jwt = require("jsonwebtoken");

const config = require(`${appRoot}/src/config`);

/**
 * @param {number} userId
 * @param {number} fkCompany
 * @returns {string}
 */
const getAccessToken = async (userId, fkCompany) => {
  return await jwt.sign(
    {id: userId, companyId: fkCompany},
    process.env.JWT_SECERT || config.jwtSecret,
    {expiresIn: "12h"}
  );
};

module.exports = {
  getAccessToken
};