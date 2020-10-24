import constants from '@config/constants';
import logger from '@lib/logger';
import { AuthenticateRequest } from '@middleware/authenticate';
import { InsertionError, ResourceError } from '@modules/errors';
import resourceService from '@services/resource';
import { NextFunction, Response } from 'express';

const create = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productSupplierData = req.body;

    await resourceService.insertOne(
      'productSupplier',
      { ...productSupplierData, fkCompany: req.accessToken.companyId },
      "L'association entre le produit et le fournisseur existe déjà"
    );

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId: req.accessToken.id,
    });
    res.send({
      success: true,
      message:
        "L'association entre le produit et le fournisseur a été créée avec succès",
    });
  } catch (e) {
    if (
      typeof e.errno !== 'undefined' &&
      e.errno === constants.dbErrorCodes.foreignKeyConstraintAddError
    ) {
      return next(
        new InsertionError("Le produit ou le fournisseur n'existe pas")
      );
    }
    return next(e);
  }
};

const update = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fkProduct, fkSupplier, notes } = req.body;

    // Notes field is the only one that can be updated but is optional, check that it has been passed
    if (typeof notes === 'undefined') {
      return next(
        new ResourceError('Le champ à mettre à jour (notes) est manquant')
      );
    }

    await resourceService.updateOne(
      'productSupplier',
      { notes },
      { fkProduct, fkSupplier, fkCompany: req.accessToken.companyId },
      {
        notFound:
          "L'association entre le produit et le fournisseur n'existe pas",
        alreadyExists:
          'Une association entre un produit et un fournisseur avec les mêmes caractéristiques existe déjà',
      }
    );

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId: req.accessToken.id,
    });
    res.send({
      success: true,
      message:
        "L'association entre le produit et le fournisseur a été mise à jour avec succès",
    });
  } catch (e) {
    return next(e);
  }
};

const remove = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productSupplierData = req.body;

    await resourceService.removeOne(
      'productSupplier',
      { ...productSupplierData, fkCompany: req.accessToken.companyId },
      "L'association entre le produit et le fournisseur n'existe pas"
    );

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId: req.accessToken.id,
    });
    res.send({
      success: true,
      message:
        "L'association entre le produit et le fournisseur a été supprimée avec succès",
    });
  } catch (e) {
    return next(e);
  }
};

export default {
  create,
  update,
  remove,
};
