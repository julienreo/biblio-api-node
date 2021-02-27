import userController from '@controllers/user';
import middleware from '@middleware/authenticate';
import validator from '@middleware/validator';
import express from 'express';

const router = express.Router();

router.post('/login', validator.validateType('userDetails'), userController.login);

router.post('/', middleware.authenticate, validator.validateType('user'), userController.create);

export default router;
