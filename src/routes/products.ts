import productController from '@controllers/product';
import supplierController from '@controllers/supplier';
import middleware from '@middleware/authenticate';
import validator from '@middleware/validator';
import express from 'express';

const router = express.Router();

router.get(
  '/:productId',
  middleware.authenticate,
  validator.validateParam('productId', 'number'),
  productController.fetchOne
);

router.get('/', middleware.authenticate, productController.fetchAll);

router.post(
  '/:productId/suppliers',
  middleware.authenticate,
  validator.validateParam('productId', 'number'),
  validator.validateType('supplier'),
  supplierController.create
);

router.post(
  '/',
  middleware.authenticate,
  validator.validateType('product'),
  productController.create
);

router.put(
  '/:productId',
  middleware.authenticate,
  validator.validateType('product'),
  productController.update
);

router.delete(
  '/:productId',
  middleware.authenticate,
  validator.validateParam('productId', 'number'),
  productController.remove
);

export default router;
