import logger from '@lib/logger';
import { AuthenticateRequest } from '@middleware/authenticate';
import databaseService from '@services/database';
import resourceService from '@services/resource';
import { NextFunction, Response } from 'express';

const fetchOne = async (req: AuthenticateRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await resourceService.retrieveOne(
      'product',
      { id: req.params.productId, fkCompany: req.accessToken.companyId },
      "Le produit n'existe pas"
    );

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId: req.accessToken.id,
    });
    res.send({ product });
  } catch (e) {
    return next(e);
  }
};

const fetchAll = async (req: AuthenticateRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await resourceService.retrieveAll('product', {
      fkCompany: req.accessToken.companyId,
    });

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId: req.accessToken.id,
    });
    res.send({ products });
  } catch (e) {
    return next(e);
  }
};

const create = async (req: AuthenticateRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productData = req.body;
    const { supplierId } = req.params;
    const { companyId } = req.accessToken;

    productData.fkCompany = companyId;

    await databaseService.makeTransaction(async (connection) => {
      const productId = await resourceService.insertOne('product', productData, 'Le produit existe déjà', {
        connection,
      });

      if (supplierId) {
        // A supplier might not be retrieved in case it doesn't exist or doesn't belong to the company
        await resourceService.retrieveOne(
          'supplier',
          { id: supplierId, fkCompany: companyId },
          "Le fournisseur associé au produit n'existe pas",
          { connection }
        );

        // Create an association between a product and a supplier
        await resourceService.insertOne(
          'productSupplier',
          {
            fkProduct: productId,
            fkSupplier: parseInt(supplierId),
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
        message: 'Le produit a été créé avec succès',
        productId,
      });
    });
  } catch (e) {
    return next(e);
  }
};

const update = async (req: AuthenticateRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productData = req.body;

    await resourceService.updateOne(
      'product',
      { ...productData },
      {
        id: parseInt(req.params.productId),
        fkCompany: req.accessToken.companyId,
      },
      {
        notFound: "Le produit n'existe pas",
        alreadyExists: 'Un produit avec les mêmes caractéristiques existe déjà',
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
      message: 'Le produit a été mis à jour avec succès',
    });
  } catch (e) {
    return next(e);
  }
};

const remove = async (req: AuthenticateRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const { companyId } = req.accessToken;

    await databaseService.makeTransaction(async (connection) => {
      // Delete an association between a product and a supplier for a specific company
      await resourceService.removeOne(
        'productSupplier',
        { fkProduct: parseInt(productId), fkCompany: companyId },
        null,
        { connection }
      );

      // Delete a product that belongs to a company
      await resourceService.removeOne(
        'product',
        { id: parseInt(productId), fkCompany: companyId },
        "Le produit n'existe pas",
        { connection }
      );
    });

    logger.info({
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId: req.accessToken.id,
    });
    res.send({
      success: true,
      message: 'Le produit a été supprimé avec succès',
    });
  } catch (e) {
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
