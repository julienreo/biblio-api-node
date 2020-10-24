import constants from '@config/constants';
import logger from '@lib/logger';
import { AuthenticateRequest } from '@middleware/authenticate';
import { RemovalError } from '@modules/errors';
import databaseService from '@services/database';
import resourceService from '@services/resource';
import { NextFunction, Response } from 'express';

const fetchOne = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { supplierId } = req.params;

    const supplier = await resourceService.retrieveOne(
      'supplier',
      { id: supplierId, fkCompany: req.accessToken.companyId },
      "Le fournisseur n'existe pas"
    );

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId: req.accessToken.id,
    });
    res.send({ supplier });
  } catch (e) {
    return next(e);
  }
};

const fetchAll = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const suppliers = await resourceService.retrieveAll('supplier', {
      fkCompany: req.accessToken.companyId,
    });

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId: req.accessToken.id,
    });
    res.send({ suppliers });
  } catch (e) {
    return next(e);
  }
};

const create = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const supplierData = req.body;
    const { productId } = req.params;
    const { companyId } = req.accessToken;

    supplierData.fkCompany = companyId;

    await databaseService.makeTransaction(async (connection) => {
      const supplierId = await resourceService.insertOne(
        'supplier',
        supplierData,
        'Le fournisseur existe déjà',
        { connection }
      );

      if (productId) {
        // A product might not be retrieved in case it doesn't exist or doesn't belong to the company
        await resourceService.retrieveOne(
          'product',
          { id: productId, fkCompany: companyId },
          "Le produit associé au fournisseur n'existe pas",
          { connection }
        );

        // Create an association between a product and a supplier
        await resourceService.insertOne(
          'productSupplier',
          {
            fkProduct: parseInt(productId),
            fkSupplier: supplierId,
            fkCompany: companyId,
          },
          "L'association entre le produit et le fournisseur existe déjà",
          { connection }
        );
      }

      logger.info({
        ip: req.ip,
        path: req.originalUrl,
        method: req.method,
        userId: req.accessToken.id,
      });
      res.send({
        success: true,
        message: 'Le fournisseur a été créé avec succès',
        supplierId,
      });
    });
  } catch (e) {
    return next(e);
  }
};

const update = async (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const supplierData = req.body;

    await resourceService.updateOne(
      'supplier',
      { ...supplierData },
      {
        id: parseInt(req.params.supplierId),
        fkCompany: req.accessToken.companyId,
      },
      {
        notFound: "Le fournisseur n'existe pas",
        alreadyExists:
          'Un fournisseur avec les mêmes caractéristiques existe déjà',
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
      message: 'Le fournisseur a été mis à jour avec succès',
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
    await resourceService.removeOne(
      'supplier',
      {
        id: parseInt(req.params.supplierId),
        fkCompany: req.accessToken.companyId,
      },
      "Le fournisseur n'existe pas"
    );

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId: req.accessToken.id,
    });
    res.send({
      success: true,
      message: 'Le fournisseur a été supprimé avec succès',
    });
  } catch (e) {
    if (
      typeof e.errno !== 'undefined' &&
      e.errno === constants.dbErrorCodes.foreignKeyConstraintDeleteError
    ) {
      return next(
        new RemovalError('Des produits sont associés à ce fournisseur')
      );
    }
    return next(e);
  }
};

export default {
  fetchOne,
  fetchAll,
  create,
  update,
  remove,
};
