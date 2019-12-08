const appRoot = require("app-root-path");

const databaseService = require(`${appRoot}/src/services/database`);
const {dbErrorCodes} = require(`${appRoot}/src/config/constants`);
const resourceService = require(`${appRoot}/src/services/resource`);
const {NotFoundError} = require(`${appRoot}/src/modules/errors/resource`);
const {InsertionError, RemovalError} = require(`${appRoot}/src/modules/errors/database`);
const logger = require(`${appRoot}/lib/logger`);

const find = async (req, res, next) => {
  try {
    const {supplierId} = req.params;

    const supplier = await resourceService.retrieveOne(
      "supplier",
      {id: supplierId, fkUser: req.accessToken.id},
      "Le fournisseur n'existe pas"
    );

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({supplier});
  } catch (e) {
    if (e instanceof NotFoundError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id, error: e});
      return res.status(e.status).send({error: e.getMessage()});
    }
    return next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const supplierData = req.body;
    const {productId} = req.params;
    const userId = req.accessToken.id;

    supplierData.fkUser = userId;

    await databaseService.makeTransaction(async (connection) => {
      const supplierId = await resourceService.insertOne(
        "supplier",
        supplierData,
        "Le fournisseur existe déjà",
        {connection}
      );

      if (productId) {
        // A product might not be retrieved in case it doesn't exist or doesn't belong to the user
        await resourceService.retrieveOne(
          "product",
          {id: productId, fkUser: userId},
          "Le produit n'existe pas",
          {connection}
        );

        // Create an association between a product and a supplier
        await resourceService.insertOne(
          "productSupplier",
          {fkProduct: productId, fkSupplier: supplierId, fkUser: userId},
          "L'association entre le produit et le fournisseur existe déjà",
          {connection}
        );
      }
    });

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({success: true, message: "Le fournisseur a été créé avec succès"});
  } catch (e) {
    if (e instanceof InsertionError || e instanceof NotFoundError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id, error: e});
      return res.status(e.status).send({error: e.getMessage()});
    }
    return next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const supplierData = req.body;
    const {supplierId} = req.params;
    const userId = req.accessToken.id;

    await resourceService.updateOne(
      "supplier",
      {...supplierData},
      {id: supplierId, fkUser: userId},
      {notFound: "Le fournisseur n'existe pas", alreadyExists: "Un fournisseur avec les mêmes caractéristiques existe déjà"}
    );

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({success: true, message: "Le fournisseur a été mis à jour avec succès"});
  } catch (e) {
    if (e instanceof NotFoundError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id, error: e});
      return res.status(e.status).send({error: e.getMessage()});
    }
    return next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const {supplierId} = req.params;

    await resourceService.removeOne(
      "supplier",
      {id: supplierId, fkUser: req.accessToken.id},
      "Le fournisseur n'existe pas"
    );

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({success: true, message: "Le fournisseur a été supprimé avec succès"});
  } catch (e) {
    if (e instanceof NotFoundError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id, error: e});
      return res.status(e.status).send({error: e.getMessage()});
    }
    if (typeof e.errno !== "undefined" && e.errno === dbErrorCodes.foreignKeyConstraintDeleteError) {
      const error = new RemovalError("Des produits sont associés à ce fournisseur");
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id, error});
      return res.status(error.status).send({error: error.getMessage()});
    }
    return next(e);
  }
};

module.exports = {
  find,
  create,
  update,
  remove
};