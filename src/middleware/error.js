const appRoot = require("app-root-path");

const {statusCodes} = require(`${appRoot}/src/config/constants`);
const {NotFoundError} = require(`${appRoot}/src/modules/errors`);
const logger = require(`${appRoot}/lib/logger`);

const notFound = (req, res) => {
  const userId = typeof req.accessToken === "undefined" ? null : req.accessToken.id;

  const error = new NotFoundError("La page demandée n'existe pas");
  logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId, error});
  res.status(error.status).send({error: error.getMessage()});
};

// eslint-disable-next-line no-unused-vars
const server = (err, req, res, next) => {
  const userId = typeof req.accessToken === "undefined" ? null : req.accessToken.id;

  logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId, err});
  res.status(err.status || statusCodes.internalServerError).send({error: err.message});
};

module.exports = {
  notFound,
  server
};