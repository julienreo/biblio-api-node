const appRoot = require("app-root-path");

const jwt = require("jsonwebtoken");

const {MissingTokenError, InvalidTokenError} = require(`${appRoot}/src/modules/errors`);
const config = require(`${appRoot}/src/config`);

const authenticate = (req, res, next) => {
  const accessToken = req.headers["access-token"];

  if (typeof accessToken === "undefined") {
    return next(new MissingTokenError("Token manquant"));
  }

  try {
    req.accessToken = jwt.verify(accessToken, process.env.JWT_SECRET || config.jwtSecret);
  } catch (e) {
    return next(new InvalidTokenError("Token invalide"));
  }

  return next();
};

module.exports = authenticate;