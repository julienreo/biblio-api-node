import constants from '@config/constants';
import middleware from '@middleware/authenticate';
import validator from '@middleware/validator';
import express from 'express';

const router = express.Router();

router.post(
  '/products',
  middleware.authenticate,
  validator.validateType('product'),
  (req, res) => {
    res.status(constants.statusCodes.success).send({ success: true });
  }
);

router.post(
  '/suppliers',
  middleware.authenticate,
  validator.validateType('supplier'),
  (req, res) => {
    res.status(constants.statusCodes.success).send({ success: true });
  }
);

export default router;
