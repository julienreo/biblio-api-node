import products from '@routes/products';
import productsSuppliers from '@routes/products-suppliers';
import suppliers from '@routes/suppliers';
import users from '@routes/users';
import validator from '@routes/validator';
import express from 'express';

const router = express.Router();

router.use('/users', users);

router.use('/products', products);

router.use('/suppliers', suppliers);

// Associtation between a product and a supplier
router.use('/productsSuppliers', productsSuppliers);

router.use('/validator', validator);

export default router;
