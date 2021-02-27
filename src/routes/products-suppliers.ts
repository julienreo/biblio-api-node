import productSupplierController from '@controllers/product-supplier';
import middleware from '@middleware/authenticate';
import validator from '@middleware/validator';
import express from 'express';

const router = express.Router();

router.post('/', middleware.authenticate, validator.validateType('productSupplier'), productSupplierController.create);

router.put('/', middleware.authenticate, validator.validateType('productSupplier'), productSupplierController.update);

router.delete(
  '/',
  middleware.authenticate,
  validator.validateType('productSupplier'),
  productSupplierController.remove
);

export default router;
