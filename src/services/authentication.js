const appRoot = require("app-root-path");
const jwt = require("jsonwebtoken");

const config = require(`${appRoot}/src/config`);

/**
 * @param {number} userId
 * @returns {string}
 */
const getAccessToken = async (userId) => {
  return await jwt.sign(
    {id: userId},
    process.env.JWT_SECERT || config.jwtSecret,
    {expiresIn: "12h"}
  );
};

module.exports = {
  getAccessToken
};