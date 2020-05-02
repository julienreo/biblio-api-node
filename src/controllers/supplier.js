const appRoot = require("app-root-path");

const databaseService = require(`${appRoot}/src/services/database`);
const {dbErrorCodes} = require(`${appRoot}/src/config/constants`);
const resourceService = require(`${appRoot}/src/services/resource`);
const {RemovalError} = require(`${appRoot}/src/modules/errors`);
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
          "Le produit associé au fournisseur n'existe pas",
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

      logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
      res.send({success: true, message: "Le fournisseur a été créé avec succès", supplierId});
    });
  } catch (e) {
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
    if (typeof e.errno !== "undefined" && e.errno === dbErrorCodes.foreignKeyConstraintDeleteError) {
      return next(new RemovalError("Des produits sont associés à ce fournisseur"));
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