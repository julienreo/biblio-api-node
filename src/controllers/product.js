const appRoot = require("app-root-path");

const resourceService = require(`${appRoot}/src/services/resource`);
const {NotFoundError} = require(`${appRoot}/src/modules/errors/resource`);
const {InsertionError} = require(`${appRoot}/src/modules/errors/database`);
const databaseService = require(`${appRoot}/src/services/database`);
const logger = require(`${appRoot}/lib/logger`);

const find = async (req, res, next) => {
  try {
    const {productId} = req.params;

    const product = await resourceService.retrieveOne(
      "product",
      {id: productId, fkUser: req.accessToken.id},
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

const create = async (req, res, next) => {
  try {
    const productData = req.body;
    const {supplierId} = req.params;
    const userId = req.accessToken.id;

    productData.fkUser = userId;

    await databaseService.makeTransaction(async (connection) => {
      const productId = await resourceService.insertOne(
        "product",
        productData,
        "Le produit existe déjà",
        {connection}
      );

      if (supplierId) {
        // A supplier might not be retrieved in case it doesn't exist or doesn't belong to the user
        await resourceService.retrieveOne(
          "supplier",
          {id: supplierId, fkUser: userId},
          "Le fournisseur n'existe pas",
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
    const {productId} = req.params;
    const userId = req.accessToken.id;

    await resourceService.updateOne(
      "product",
      {...productData},
      {id: productId, fkUser: userId},
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
    const userId = req.accessToken.id;

    await databaseService.makeTransaction(async (connection) => {
      // Delete an association between a product and a supplier for a corresponding user
      await resourceService.removeOne(
        "productSupplier",
        {fkProduct: productId, fkUser: userId},
        null,
        {connection}
      );

      // Delete a product that belongs to a user
      await resourceService.removeOne(
        "product",
        {id: productId, fkUser: userId},
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
  find,
  create,
  update,
  remove
};