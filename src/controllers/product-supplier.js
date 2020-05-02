const appRoot = require("app-root-path");

const {dbErrorCodes} = require(`${appRoot}/src/config/constants`);
const resourceService = require(`${appRoot}/src/services/resource`);
const {InsertionError, ResourceError} = require(`${appRoot}/src/modules/errors`);
const logger = require(`${appRoot}/lib/logger`);

const create = async (req, res, next) => {
  try {
    const productSupplierData = req.body;

    await resourceService.insertOne(
      "productSupplier",
      {...productSupplierData, fkCompany: req.accessToken.companyId},
      "L'association entre le produit et le fournisseur existe déjà"
    );

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({success: true, message: "L'association entre le produit et le fournisseur a été créée avec succès"});
  } catch (e) {
    if (typeof e.errno !== "undefined" && e.errno === dbErrorCodes.foreignKeyConstraintAddError) {
      return next(new InsertionError("Le produit ou le fournisseur n'existe pas"));
    }
    return next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const {fkProduct, fkSupplier, notes} = req.body;

    // Notes field is the only one that can be updated but is optional, check that it has been passed
    if (typeof notes === "undefined") {
      return next(new ResourceError("Le champ à mettre à jour (notes) est manquant"));
    }

    await resourceService.updateOne(
      "productSupplier",
      {notes},
      {fkProduct, fkSupplier, fkCompany: req.accessToken.companyId},
      {
        notFound: "L'association entre le produit et le fournisseur n'existe pas",
        alreadyExists: "Une association entre un produit et un fournisseur avec les mêmes caractéristiques existe déjà"
      }
    );

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({success: true, message: "L'association entre le produit et le fournisseur a été mise à jour avec succès"});
  } catch (e) {
    return next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const productSupplierData = req.body;

    await resourceService.removeOne(
      "productSupplier",
      {...productSupplierData, fkCompany: req.accessToken.companyId},
      "L'association entre le produit et le fournisseur n'existe pas"
    );

    logger.info({ip: req.ip, path: req.originalUrl, method: req.method, userId: req.accessToken.id});
    res.send({success: true, message: "L'association entre le produit et le fournisseur a été supprimée avec succès"});
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  create,
  update,
  remove
};