const appRoot = require("app-root-path");

const databaseService = require(`${appRoot}/src/services/database`);
const {dbErrorCodes} = require(`${appRoot}/src/config/constants`);
const resourceService = require(`${appRoot}/src/services/resource`);
const {NotFoundError, InsertionError, RemovalError} = require(`${appRoot}/src/modules/errors`);
const logger = require(`${appRoot}/lib/logger`);

const fetchOne = async (req, res, next) => {
  try {
    const {supplierId} = req.params;

    const supplier = await resourceService.retrieveOne(
      "supplier",
      {id: supplierId, fkCompany: req.accessToken.companyId},
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

const fetchAll = async (req, res, next) => {
  try {
    const suppliers = await resourceService.retrieveAll(
      "supplier",
      {fkCompany: req.accessToken.companyId}
    );

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({suppliers});
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
    const {companyId} = req.accessToken;

    supplierData.fkCompany = companyId;

    await databaseService.makeTransaction(async (connection) => {
      const supplierId = await resourceService.insertOne(
        "supplier",
        supplierData,
        "Le fournisseur existe déjà",
        {connection}
      );

      if (productId) {
        // A product might not be retrieved in case it doesn't exist or doesn't belong to the company
        await resourceService.retrieveOne(
          "product",
          {id: productId, fkCompany: companyId},
          "Le produit n'existe pas",
          {connection}
        );

        // Create an association between a product and a supplier
        await resourceService.insertOne(
          "productSupplier",
          {fkProduct: productId, fkSupplier: supplierId, fkCompany: companyId},
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

    await resourceService.updateOne(
      "supplier",
      {...supplierData},
      {id: req.params.supplierId, fkCompany: req.accessToken.companyId},
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
    await resourceService.removeOne(
      "supplier",
      {id: req.params.supplierId, fkCompany: req.accessToken.companyId},
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
  fetchOne,
  fetchAll,
  create,
  update,
  remove
};