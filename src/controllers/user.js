const appRoot = require("app-root-path");

const config = require(`${appRoot}/src/config`);
const resourceService = require(`${appRoot}/src/services/resource`);
const passwordService = require(`${appRoot}/src/services/password`);
const authenticationService = require(`${appRoot}/src/services/authentication`);
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

    const accessToken = await authenticationService.getAccessToken(user.id, user.fkCompany);

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userEmail: user.email});
    res.send({success: true, message: "Connexion réussie", accessToken});
  } catch (e) {
    return next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userData = req.body;
    const {companyId} = req.accessToken;

    userData.fkCompany = companyId;
    userData.password = await passwordService.hashPassword(userData.password, config.bcryptSaltRound);

    const userId = await resourceService.insertOne("user", userData, "L'utilisateur existe déjà");

    const accessToken = await authenticationService.getAccessToken(userId, companyId);

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userEmail: userData.email});
    res.send({success: true, message: "Utilisateur créé avec succès", accessToken});
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  login,
  create
};