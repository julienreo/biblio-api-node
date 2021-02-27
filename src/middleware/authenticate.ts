import config from '@config/index';
import { createError } from '@src/modules/errors/index';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AccessToken {
  companyId: number;
  exp: number;
  iat: number;
  id: number;
}

export interface AuthenticateRequest extends Request {
  accessToken: AccessToken;
}

/**
 * @param req
 * @param res
 * @param next
 */
const authenticate: RequestHandler = (req: AuthenticateRequest, res: Response, next: NextFunction) => {
  const accessToken = req.headers['access-token'] as string;

  if (typeof accessToken === 'undefined') {
    return next(createError('MissingTokenError', 'Token manquant'));
  }

  try {
    req.accessToken = jwt.verify(accessToken, process.env.JWT_SECRET || config.jwtSecret) as AccessToken;
    return next();
  } catch (e) {
    return next(createError('InvalidTokenError', 'Token invalide'));
  }
};

export default {
  authenticate,
};
