const appRoot = require("app-root-path");

const resourceService = require(`${appRoot}/src/services/resource`);
const {NotFoundError} = require(`${appRoot}/src/modules/errors/resource`);
const {InsertionError} = require(`${appRoot}/src/modules/errors/database`);
const databaseService = require(`${appRoot}/src/services/database`);
const logger = require(`${appRoot}/lib/logger`);

const fetchOne = async (req, res, next) => {
  try {
    const product = await resourceService.retrieveOne(
      "product",
      {id: req.params.productId, fkCompany: req.accessToken.companyId},
      "Le produit n'existe pas"
    );

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({product});
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
    const products = await resourceService.retrieveAll(
      "product",
      {fkCompany: req.accessToken.companyId}
    );

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({products});
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
    const productData = req.body;
    const {supplierId} = req.params;
    const {companyId} = req.accessToken;

    productData.fkCompany = companyId;

    await databaseService.makeTransaction(async (connection) => {
      const productId = await resourceService.insertOne(
        "product",
        productData,
        "Le produit existe déjà",
        {connection}
      );

      if (supplierId) {
        // A supplier might not be retrieved in case it doesn't exist or doesn't belong to the company
        await resourceService.retrieveOne(
          "supplier",
          {id: supplierId, fkCompany: companyId},
          "Le fournisseur n'existe pas",
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
    res.send({success: true, message: "Le produit a été créé avec succès"});
  } catch (e) {
    if (e instanceof InsertionError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id, error: e});
      return res.status(e.status).send({error: e.getMessage()});
    }
    return next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const productData = req.body;

    await resourceService.updateOne(
      "product",
      {...productData},
      {id: req.params.productId, fkCompany: req.accessToken.companyId},
      {notFound: "Le produit n'existe pas", alreadyExists: "Un produit avec les mêmes caractéristiques existe déjà"}
    );

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({success: true, message: "Le produit a été mis à jour avec succès"});
  } catch (e) {
    if (e instanceof NotFoundError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id, error: e});
      return res.status(e.status).send({error: e.getMessage()});
    }
    if (e instanceof InsertionError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id, error: e});
      return res.status(e.status).send({error: e.getMessage()});
    }
    return next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const {productId} = req.params;
    const {companyId} = req.accessToken;

    await databaseService.makeTransaction(async (connection) => {
      // Delete an association between a product and a supplier for a specific company
      await resourceService.removeOne(
        "productSupplier",
        {fkProduct: productId, fkCompany: companyId},
        null,
        {connection}
      );

      // Delete a product that belongs to a company
      await resourceService.removeOne(
        "product",
        {id: productId, fkCompany: companyId},
        "Le produit n'existe pas",
        {connection}
      );
    });

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({success: true, message: "Le produit a été supprimé avec succès"});
  } catch (e) {
    if (e instanceof NotFoundError) {
      logger.error({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id, error: e});
      return res.status(e.status).send({error: e.getMessage()});
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