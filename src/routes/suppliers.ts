import productController from '@controllers/product';
import supplierController from '@controllers/supplier';
import middleware from '@middleware/authenticate';
import validator from '@middleware/validator';
import express from 'express';

const router = express.Router();

router.get(
  '/:supplierId',
  middleware.authenticate,
  validator.validateParam('supplierId', 'number'),
  supplierController.fetchOne
);

router.get('/', middleware.authenticate, supplierController.fetchAll);

router.post(
  '/:supplierId/products',
  middleware.authenticate,
  validator.validateParam('supplierId', 'number'),
  validator.validateType('product'),
  productController.create
);

router.post('/', middleware.authenticate, validator.validateType('supplier'), supplierController.create);

router.put('/:supplierId', middleware.authenticate, validator.validateType('supplier'), supplierController.update);

router.delete(
  '/:supplierId',
  middleware.authenticate,
  validator.validateParam('supplierId', 'number'),
  supplierController.remove
);

export default router;
