const appRoot = require("app-root-path");

const config = require(`${appRoot}/src/config`);
const resourceService = require(`${appRoot}/src/services/resource`);
const passwordService = require(`${appRoot}/src/services/password`);
const authenticationService = require(`${appRoot}/src/services/authentication`);
const {NotFoundError, ValidationError} = require(`${appRoot}/src/modules/errors/resource`);
const {InsertionError} = require(`${appRoot}/src/modules/errors/database`);
const logger = require(`${appRoot}/lib/logger`);

const login = async (req, res, next) => {
  try {
    const userData = req.body;

    const user = await resourceService.retrieveOne(
      "user",
      {email: userData.email.toLowerCase()},
      "L'utilisateur n'existe pas"
    );

    await passwordService.comparePassword(userData.password, user.password);

    const accessToken = await authenticationService.getAccessToken(user.id);

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userEmail: user.email});
    res.send({success: true, message: "Connexion réussie", accessToken});
  } catch (e) {
    if (e instanceof NotFoundError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userEmail: req.body.email, error: e});
      return res.status(e.status).send({error: e.getMessage()});
    }
    if (e instanceof ValidationError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userEmail: req.body.email, error: e});
      return res.status(e.status).send({error: e.getMessage()});
    }
    return next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userData = req.body;
    userData.password = await passwordService.hashPassword(userData.password, config.bcryptSaltRound);

    const userId = await resourceService.insertOne("user", userData, "L'utilisateur existe déjà");

    const accessToken = await authenticationService.getAccessToken(userId);

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userEmail: userData.email});
    res.send({success: true, message: "Utilisateur créé avec succès", accessToken});
  } catch (e) {
    if (e instanceof InsertionError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userEmail: req.body.email, error: e});
      return res.status(e.status).send({error: e.getMessage()});
    }
    return next(e);
  }
};

module.exports = {
  login,
  create
};